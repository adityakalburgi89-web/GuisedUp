<?php

/**
 * Post Creation Tests
 *
 * Tests for POST /api/posts — authenticated post creation with embedding.
 */

use App\Models\Post;
use App\Models\User;

it('creates a post when authenticated', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/posts', [
            'image_path'          => '/images/test.jpg',
            'original_image_path' => '/images/original.jpg',
            'caption'             => 'My first post!',
            'has_filter'          => true,
            'image_polish_level'  => 3,
        ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['id', 'user_id', 'image_path', 'caption', 'user']);

    expect($response->json('user_id'))->toBe($user->id);
    expect($response->json('caption'))->toBe('My first post!');
    $this->assertDatabaseHas('posts', [
        'user_id'    => $user->id,
        'caption'    => 'My first post!',
        'has_filter' => true,
    ]);
});

it('rejects post creation without authentication', function () {
    $response = $this->postJson('/api/posts', [
        'image_path' => '/images/test.jpg',
        'caption'    => 'No auth',
    ]);

    $response->assertStatus(401);
});

it('validates required image_path field', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/posts', [
            'caption' => 'Missing image path',
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('image_path');
});

it('creates a post without optional fields', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/posts', [
            'image_path' => '/images/minimal.jpg',
        ]);

    $response->assertStatus(201);
    expect($response->json('caption'))->toBeNull();
    expect($response->json('has_filter'))->toBeFalse();
    expect($response->json('image_polish_level'))->toBe(0);
});

it('shows a single post by id', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create([
        'user_id' => $user->id,
        'caption' => 'Single post view',
    ]);

    $response = $this->getJson("/api/posts/{$post->id}");

    $response->assertOk()
        ->assertJson([
            'id'      => $post->id,
            'caption' => 'Single post view',
        ]);
});

it('returns 404 for non-existent post', function () {
    $response = $this->getJson('/api/posts/99999');

    $response->assertStatus(404);
});

it('rejects image_polish_level outside valid range', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/posts', [
            'image_path'         => '/images/test.jpg',
            'image_polish_level' => 15,
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('image_polish_level');
});
