<?php

/**
 * Feed Endpoint Tests
 *
 * Tests for GET /api/feed — public access with pagination.
 */

use App\Models\Post;
use App\Models\User;

it('returns paginated feed as JSON', function () {
    $user = User::factory()->create();
    Post::factory()->count(5)->create(['user_id' => $user->id]);

    $response = $this->getJson('/api/feed');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [['id', 'user_id', 'image_path', 'caption', 'user']],
            'current_page',
        ]);
});

it('respects per_page parameter', function () {
    $user = User::factory()->create();
    Post::factory()->count(10)->create(['user_id' => $user->id]);

    $response = $this->getJson('/api/feed?per_page=3');

    $response->assertOk();
    expect($response->json('data'))->toHaveCount(3);
});

it('returns correct pagination metadata', function () {
    $user = User::factory()->create();
    Post::factory()->count(12)->create(['user_id' => $user->id]);

    $response = $this->getJson('/api/feed?per_page=5&page=2');

    $response->assertOk();
    $json = $response->json();
    expect($json['current_page'])->toBe(2);
});

it('returns empty array when no posts exist', function () {
    $response = $this->getJson('/api/feed');

    $response->assertOk();
    expect($response->json('data'))->toBeArray()->toBeEmpty();
});

it('includes interactions count in feed posts', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    $response = $this->getJson('/api/feed');

    $response->assertOk();
    $firstPost = $response->json('data.0');
    expect($firstPost)->toHaveKey('interactions_count');
});

it('feed is accessible without authentication', function () {
    $response = $this->getJson('/api/feed');

    $response->assertOk();
});
