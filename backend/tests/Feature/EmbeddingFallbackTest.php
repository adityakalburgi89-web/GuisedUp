<?php

/**
 * Embedding Fallback Tests
 *
 * Tests that the EmbeddingService falls back to deterministic hash
 * embeddings when the FastAPI embedding service is unreachable.
 */

use App\Services\EmbeddingService;

it('produces a 384-dimensional embedding via fallback', function () {
    // Configure a non-existent URL to force fallback
    config(['services.embedding.url' => 'http://127.0.0.1:1']);

    $service = new EmbeddingService();
    $embedding = $service->embed('test text for embedding');

    expect($embedding)->toBeArray()->toHaveCount(384);
});

it('produces a normalized unit vector', function () {
    config(['services.embedding.url' => 'http://127.0.0.1:1']);

    $service = new EmbeddingService();
    $embedding = $service->embed('normalization check');

    // L2 norm should be approximately 1.0
    $magnitude = sqrt(array_sum(array_map(fn ($x) => $x * $x, $embedding)));
    expect($magnitude)->toBeGreaterThan(0.99)->toBeLessThan(1.01);
});

it('produces deterministic embeddings for the same input', function () {
    config(['services.embedding.url' => 'http://127.0.0.1:1']);

    $service = new EmbeddingService();
    $embedding1 = $service->embed('deterministic test');
    $embedding2 = $service->embed('deterministic test');

    expect($embedding1)->toBe($embedding2);
});

it('produces different embeddings for different inputs', function () {
    config(['services.embedding.url' => 'http://127.0.0.1:1']);

    $service = new EmbeddingService();
    $embedding1 = $service->embed('first text');
    $embedding2 = $service->embed('second text');

    expect($embedding1)->not->toBe($embedding2);
});

it('converts embedding to pgvector string format', function () {
    $service = new EmbeddingService();
    $vectorString = $service->toVectorString([0.1, 0.2, 0.3]);

    expect($vectorString)->toBe('[0.1,0.2,0.3]');
});

it('reports service as unhealthy when unreachable', function () {
    config(['services.embedding.url' => 'http://127.0.0.1:1']);

    $service = new EmbeddingService();

    expect($service->healthy())->toBeFalse();
});
