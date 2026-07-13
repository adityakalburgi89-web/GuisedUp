<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class FeedRankingService
{
    /**
     * Weight constants for the ranking formula.
     *
     * Score = (engagement_score + 1) * recency_decay * follow_boost
     *
     * - engagement_score = (likes * LIKE_WEIGHT) + (views * VIEW_WEIGHT)
     * - recency_decay    = 1 / (1 + hours_since_post * DECAY_RATE)
     * - follow_boost     = FOLLOW_MULTIPLIER if author is followed, else 1.0
     */
    private const LIKE_WEIGHT = 3.0;
    private const VIEW_WEIGHT = 1.0;
    private const DECAY_RATE = 0.1;
    private const FOLLOW_MULTIPLIER = 1.5;

    /**
     * Return a ranked, paginated feed for a given user.
     *
     * Uses a single raw PostgreSQL query that computes the composite score
     * inline so the database does the heavy lifting (no N+1, no in-memory sort).
     *
     * @param  int  $userId   Authenticated user's ID
     * @param  int  $perPage  Items per page (clamped 1–50 by the controller)
     * @param  int  $page     Current page number
     * @return array{data: array, total: int, per_page: int, current_page: int, last_page: int}
     */
    public function ranked(int $userId, int $perPage = 10, int $page = 1): array
    {
        $likeW  = self::LIKE_WEIGHT;
        $viewW  = self::VIEW_WEIGHT;
        $decay  = self::DECAY_RATE;
        $follow = self::FOLLOW_MULTIPLIER;
        $offset = ($page - 1) * $perPage;

        $sql = <<<SQL
            WITH engagement AS (
                SELECT
                    post_id,
                    COALESCE(SUM(CASE WHEN type = 'like' THEN {$likeW} ELSE 0 END), 0)
                  + COALESCE(SUM(CASE WHEN type = 'view' THEN {$viewW} ELSE 0 END), 0) AS score
                FROM interactions
                GROUP BY post_id
            ),
            followed_authors AS (
                SELECT following_id
                FROM follows
                WHERE follower_id = ?
            )
            SELECT
                p.*,
                u.id   AS author_id,
                u.name AS author_name,
                u.email AS author_email,
                COALESCE(e.score, 0) AS engagement_score,
                (COALESCE(e.score, 0) + 1)
                  * (1.0 / (1.0 + EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600.0 * {$decay}))
                  * CASE WHEN fa.following_id IS NOT NULL THEN {$follow} ELSE 1.0 END
                AS rank_score
            FROM posts p
            INNER JOIN users u ON u.id = p.user_id
            LEFT JOIN engagement e ON e.post_id = p.id
            LEFT JOIN followed_authors fa ON fa.following_id = p.user_id
            ORDER BY rank_score DESC, p.created_at DESC
            LIMIT ? OFFSET ?
        SQL;

        $countSql = 'SELECT COUNT(*) AS total FROM posts';

        $rows  = DB::select($sql, [$userId, $perPage, $offset]);
        $total = DB::selectOne($countSql)->total;
        $lastPage = max(1, (int) ceil($total / $perPage));

        $data = array_map(fn ($row) => $this->formatPost($row), $rows);

        return [
            'data'         => $data,
            'total'        => (int) $total,
            'per_page'     => $perPage,
            'current_page' => $page,
            'last_page'    => $lastPage,
        ];
    }

    /**
     * Map a raw DB row to a Post + User shape matching the Eloquent JSON output.
     */
    private function formatPost(object $row): array
    {
        return [
            'id'                  => $row->id,
            'user_id'             => $row->user_id,
            'image_path'          => $row->image_path,
            'original_image_path' => $row->original_image_path,
            'caption'             => $row->caption,
            'has_filter'          => (bool) $row->has_filter,
            'image_polish_level'  => (int) $row->image_polish_level,
            'created_at'          => $row->created_at,
            'updated_at'          => $row->updated_at,
            'engagement_score'    => (float) $row->engagement_score,
            'rank_score'          => round((float) $row->rank_score, 6),
            'user' => [
                'id'    => $row->author_id,
                'name'  => $row->author_name,
                'email' => $row->author_email,
            ],
        ];
    }
}
