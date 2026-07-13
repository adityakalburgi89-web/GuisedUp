<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\EmbeddingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    public function __construct(
        private readonly EmbeddingService $embedding,
    ) {}

    /**
     * Create a new post (authenticated).
     *
     * Generates an embedding from the caption text (or image_path as
     * fallback input) and stores it as a pgvector column.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image_path'          => 'required|string|max:500',
            'original_image_path' => 'nullable|string|max:500',
            'caption'             => 'nullable|string|max:2000',
            'has_filter'          => 'sometimes|boolean',
            'image_polish_level'  => 'sometimes|integer|min:0|max:10',
        ]);

        $user = $request->user();

        // Create the post first (without embedding)
        $post = Post::create([
            'user_id'             => $user->id,
            'image_path'          => $validated['image_path'],
            'original_image_path' => $validated['original_image_path'] ?? null,
            'caption'             => $validated['caption'] ?? null,
            'has_filter'          => $validated['has_filter'] ?? false,
            'image_polish_level'  => $validated['image_polish_level'] ?? 0,
        ]);

        // Generate and store embedding
        $textForEmbedding = $validated['caption'] ?? $validated['image_path'];
        $embedding = $this->embedding->embed($textForEmbedding);
        $vectorString = $this->embedding->toVectorString($embedding);

        if (DB::getDriverName() === 'pgsql') {
            DB::statement(
                'UPDATE posts SET embedding = ?::vector WHERE id = ?',
                [$vectorString, $post->id]
            );
        }

        $post->load('user');
        $post->loadCount('interactions');

        return response()->json($post, 201);
    }

    /**
     * Show a single post.
     */
    public function show(int $id): JsonResponse
    {
        $post = Post::with('user')
            ->withCount('interactions')
            ->findOrFail($id);

        return response()->json($post);
    }
}
