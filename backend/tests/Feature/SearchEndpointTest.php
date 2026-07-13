<?php

/**
 * Search Endpoint Tests
 *
 * Tests for GET /api/search — public text search with validation.
 */

use App\Models\Post;
use App\Models\User;

it('searches posts by caption text', function () {
    $user = User::factory()->create();
    Post::factory()->create(['user_id' => $user->id, 'caption' => 'Beautiful sunset photography']);
    Post::factory()->create(['user_id' => $user->id, 'caption' => 'Morning coffee vibes']);

    $response = $this->getJson('/api/search?q=sunset');

    $response->assertOk();
    $data = $response->json('data');
    expect($data)->toHaveCount(1);
    expect($data[0]['caption'])->toContain('sunset');
});

it('returns empty results for non-matching query', function () {
    $user = User::factory()->create();
    Post::factory()->create(['user_id' => $user->id, 'caption' => 'Test post']);

    $response = $this->getJson('/api/search?q=nonexistent');

    $response->assertOk();
    expect($response->json('data'))->toBeEmpty();
});

it('requires a search query parameter', function () {
    $response = $this->getJson('/api/search');

    $response->assertStatus(422)
        ->assertJsonValidationErrors('q');
});

it('paginates search results', function () {
    $user = User::factory()->create();
    Post::factory()->count(8)->create([
        'user_id' => $user->id,
        'caption' => 'Matching search term here',
    ]);

    $response = $this->getJson('/api/search?q=Matching&per_page=3');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(3);
});

it('is case-insensitive on SQLite', function () {
    $user = User::factory()->create();
    Post::factory()->create(['user_id' => $user->id, 'caption' => 'UPPERCASE CONTENT']);

    // SQLite LIKE is case-insensitive by default for ASCII
    $response = $this->getJson('/api/search?q=uppercase');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(1);
});

it('includes user relationship in search results', function () {
    $user = User::factory()->create(['name' => 'Search Author']);
    Post::factory()->create(['user_id' => $user->id, 'caption' => 'Findable post']);

    $response = $this->getJson('/api/search?q=Findable');

    $response->assertOk();
    expect($response->json('data.0.user.name'))->toBe('Search Author');
});
