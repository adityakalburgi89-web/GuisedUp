<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\EmbeddingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    public function __construct(
        private readonly EmbeddingService $embedding,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $request->validate(['q' => 'required|string|max:255']);

        $query = $request->input('q');
        $perPage = (int) $request->input('per_page', 10);
        $perPage = min(max($perPage, 1), 50);
        $mode = $request->input('mode', 'text'); // 'text', 'vector', or 'hybrid'

        // Vector search on PostgreSQL with pgvector
        if ($mode !== 'text' && DB::getDriverName() === 'pgsql') {
            return $this->vectorSearch($query, $perPage, (int) $request->input('page', 1));
        }

        // Default: text search using LIKE (case-insensitive on SQLite, use ILIKE on PG)
        $operator = DB::getDriverName() === 'pgsql' ? 'ilike' : 'like';

        $posts = Post::with('user')
            ->withCount('interactions')
            ->where('caption', $operator, "%{$query}%")
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($posts);
    }

    /**
     * Perform vector similarity search using pgvector cosine distance.
     */
    private function vectorSearch(string $query, int $perPage, int $page): JsonResponse
    {
        $embedding = $this->embedding->embed($query);
        $vectorString = $this->embedding->toVectorString($embedding);
        $offset = ($page - 1) * $perPage;

        $sql = <<<SQL
            SELECT
                p.*,
                u.id AS author_id,
                u.name AS author_name,
                u.email AS author_email,
                (p.embedding <=> ?::vector) AS distance
            FROM posts p
            INNER JOIN users u ON u.id = p.user_id
            WHERE p.embedding IS NOT NULL
            ORDER BY p.embedding <=> ?::vector
            LIMIT ? OFFSET ?
        SQL;

        $rows = DB::select($sql, [$vectorString, $vectorString, $perPage, $offset]);
        $total = DB::selectOne('SELECT COUNT(*) AS total FROM posts WHERE embedding IS NOT NULL')->total;
        $lastPage = max(1, (int) ceil($total / $perPage));

        $data = array_map(fn ($row) => [
            'id'                  => $row->id,
            'user_id'             => $row->user_id,
            'image_path'          => $row->image_path,
            'original_image_path' => $row->original_image_path,
            'caption'             => $row->caption,
            'has_filter'          => (bool) $row->has_filter,
            'image_polish_level'  => (int) $row->image_polish_level,
            'created_at'          => $row->created_at,
            'updated_at'          => $row->updated_at,
            'distance'            => round((float) $row->distance, 6),
            'user' => [
                'id'    => $row->author_id,
                'name'  => $row->author_name,
                'email' => $row->author_email,
            ],
        ], $rows);

        return response()->json([
            'data'         => $data,
            'total'        => (int) $total,
            'per_page'     => $perPage,
            'current_page' => $page,
            'last_page'    => $lastPage,
        ]);
    }
}

