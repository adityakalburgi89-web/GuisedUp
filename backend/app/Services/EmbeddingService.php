<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EmbeddingService
{
    private string $baseUrl;

    /**
     * Embedding dimension must match the pgvector column (384).
     */
    private const EMBEDDING_DIM = 384;

    public function __construct()
    {
        $this->baseUrl = rtrim((string) config('services.embedding.url', 'http://localhost:8001'), '/');
    }

    /**
     * Generate an embedding for the given text.
     *
     * Attempts the FastAPI embedding service first. If the service is
     * unreachable or returns an error, falls back to a deterministic
     * hash-based embedding so post creation never blocks.
     *
     * @return list<float>  384-dimensional unit vector
     */
    public function embed(string $text): array
    {
        try {
            $response = Http::timeout(10)
                ->post("{$this->baseUrl}/embed", ['text' => $text]);

            if ($response->successful()) {
                $embedding = $response->json('embedding');
                if (is_array($embedding) && count($embedding) === self::EMBEDDING_DIM) {
                    return $embedding;
                }
            }

            Log::warning('Embedding service returned unexpected response', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Embedding service unreachable, using fallback', [
                'error' => $e->getMessage(),
            ]);
        }

        return $this->fallback($text);
    }

    /**
     * Deterministic hash-based fallback identical to the Python service's
     * fallback so vectors are consistent regardless of which path runs.
     *
     * sha256 → seed a PRNG → draw 384 normals → L2-normalize.
     *
     * @return list<float>
     */
    private function fallback(string $text): array
    {
        $hash = hash('sha256', $text);
        $seed = intval(substr($hash, 0, 16), 16);

        mt_srand($seed);

        $vec = [];
        for ($i = 0; $i < self::EMBEDDING_DIM; $i++) {
            // Box-Muller transform for approximate normal distribution
            $u1 = mt_rand(1, mt_getrandmax()) / mt_getrandmax();
            $u2 = mt_rand(1, mt_getrandmax()) / mt_getrandmax();
            $vec[] = sqrt(-2.0 * log($u1)) * cos(2.0 * M_PI * $u2);
        }

        // L2-normalize
        $magnitude = sqrt(array_sum(array_map(fn ($x) => $x * $x, $vec)));
        if ($magnitude > 0) {
            $vec = array_map(fn ($x) => $x / $magnitude, $vec);
        }

        return $vec;
    }

    /**
     * Format an embedding array as a pgvector-compatible string.
     */
    public function toVectorString(array $embedding): string
    {
        return '[' . implode(',', $embedding) . ']';
    }

    /**
     * Check if the embedding service is healthy.
     */
    public function healthy(): bool
    {
        try {
            $response = Http::timeout(3)->get("{$this->baseUrl}/health");
            return $response->successful();
        } catch (\Throwable) {
            return false;
        }
    }
}
