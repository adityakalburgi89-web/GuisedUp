<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\FeedRankingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedController extends Controller
{
    public function __construct(
        private readonly FeedRankingService $ranking,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 10);
        $perPage = min(max($perPage, 1), 50);
        $page = max(1, (int) $request->input('page', 1));

        // Use ranked feed for authenticated users, chronological for guests
        $user = $request->user();

        if ($user && config('database.default') === 'pgsql') {
            $result = $this->ranking->ranked($user->id, $perPage, $page);
            return response()->json($result);
        }

        // Fallback: simple chronological feed (guests or non-PG environments)
        $posts = Post::with('user')
            ->withCount('interactions')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($posts);
    }
}
