-- =============================================================================
-- GuisedUp — Core PostgreSQL Queries (D1–D4)
-- Requires: pgvector extension, schema from Laravel migrations
-- =============================================================================

-- ---------------------------------------------------------------------------
-- D1: Ranked Feed
--
-- Multi-factor ranking: recency decay × engagement × follow-boost.
-- Designed for the authenticated user's personalized feed.
--
-- Parameters:
--   $1 = user_id (bigint)   — the authenticated viewer
--   $2 = limit   (int)      — items per page
--   $3 = offset  (int)      — pagination offset
-- ---------------------------------------------------------------------------
WITH engagement AS (
    SELECT
        post_id,
        COALESCE(SUM(CASE WHEN type = 'like' THEN 3.0 ELSE 0 END), 0)
      + COALESCE(SUM(CASE WHEN type = 'view' THEN 1.0 ELSE 0 END), 0) AS score
    FROM interactions
    GROUP BY post_id
),
followed_authors AS (
    SELECT following_id
    FROM follows
    WHERE follower_id = $1
)
SELECT
    p.id,
    p.user_id,
    p.image_path,
    p.original_image_path,
    p.caption,
    p.has_filter,
    p.image_polish_level,
    p.created_at,
    p.updated_at,
    u.name           AS author_name,
    u.email          AS author_email,
    COALESCE(e.score, 0) AS engagement_score,
    -- Composite ranking score
    (COALESCE(e.score, 0) + 1)
      * (1.0 / (1.0 + EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600.0 * 0.1))
      * CASE WHEN fa.following_id IS NOT NULL THEN 1.5 ELSE 1.0 END
    AS rank_score
FROM posts p
INNER JOIN users u ON u.id = p.user_id
LEFT JOIN engagement e ON e.post_id = p.id
LEFT JOIN followed_authors fa ON fa.following_id = p.user_id
ORDER BY rank_score DESC, p.created_at DESC
LIMIT $2 OFFSET $3;


-- ---------------------------------------------------------------------------
-- D2: Vector Similarity Search
--
-- Semantic search using pgvector cosine distance (<=>) against the
-- 384-dimensional all-MiniLM-L6-v2 embedding stored on each post.
--
-- Parameters:
--   $1 = query_embedding (vector(384)) — embedding of the search query
--   $2 = limit           (int)         — max results to return
-- ---------------------------------------------------------------------------
SELECT
    p.id,
    p.user_id,
    p.image_path,
    p.original_image_path,
    p.caption,
    p.has_filter,
    p.image_polish_level,
    p.created_at,
    p.updated_at,
    u.name  AS author_name,
    u.email AS author_email,
    (p.embedding <=> $1::vector) AS cosine_distance
FROM posts p
INNER JOIN users u ON u.id = p.user_id
WHERE p.embedding IS NOT NULL
ORDER BY p.embedding <=> $1::vector
LIMIT $2;


-- ---------------------------------------------------------------------------
-- D3: Engagement Aggregation per Post
--
-- For a given user's feed, compute per-post like count, view count, and
-- whether the requesting user has liked each post.
--
-- Parameters:
--   $1 = viewer_user_id (bigint) — the authenticated viewer
-- ---------------------------------------------------------------------------
SELECT
    p.id                                                        AS post_id,
    p.caption,
    p.created_at,
    u.name                                                      AS author_name,
    COUNT(i.id) FILTER (WHERE i.type = 'like')                  AS like_count,
    COUNT(i.id) FILTER (WHERE i.type = 'view')                  AS view_count,
    BOOL_OR(i.user_id = $1 AND i.type = 'like')                 AS viewer_has_liked,
    COUNT(i.id) FILTER (WHERE i.type = 'like') * 3
      + COUNT(i.id) FILTER (WHERE i.type = 'view')             AS engagement_score
FROM posts p
INNER JOIN users u ON u.id = p.user_id
LEFT JOIN interactions i ON i.post_id = p.id
GROUP BY p.id, p.caption, p.created_at, u.name
ORDER BY engagement_score DESC, p.created_at DESC;


-- ---------------------------------------------------------------------------
-- D4: Follower Interaction Graph
--
-- Shows who interacted with whom, ranked by interaction volume.
-- Useful for discovering active relationships in the social graph.
--
-- Parameters:
--   $1 = user_id (bigint) — the user whose interaction graph to query
--   $2 = limit   (int)    — max rows to return
-- ---------------------------------------------------------------------------
SELECT
    interactor.id                             AS interactor_id,
    interactor.name                           AS interactor_name,
    author.id                                 AS author_id,
    author.name                               AS author_name,
    COUNT(*)                                  AS total_interactions,
    COUNT(*) FILTER (WHERE i.type = 'like')   AS likes,
    COUNT(*) FILTER (WHERE i.type = 'view')   AS views,
    CASE
        WHEN f.id IS NOT NULL THEN TRUE
        ELSE FALSE
    END                                       AS interactor_follows_author
FROM interactions i
INNER JOIN users interactor ON interactor.id = i.user_id
INNER JOIN posts p          ON p.id = i.post_id
INNER JOIN users author     ON author.id = p.user_id
LEFT JOIN follows f
    ON f.follower_id  = i.user_id
   AND f.following_id = p.user_id
WHERE i.user_id = $1 OR p.user_id = $1
GROUP BY interactor.id, interactor.name, author.id, author.name, f.id
ORDER BY total_interactions DESC
LIMIT $2;
