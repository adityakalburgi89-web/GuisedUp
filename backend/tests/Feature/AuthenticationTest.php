<?php

/**
 * Authentication Tests
 *
 * Tests for register, login, logout endpoints using Laravel Sanctum.
 */

use App\Models\User;

it('registers a new user and returns a token', function () {
    $response = $this->postJson('/api/register', [
        'name'                  => 'Jane Doe',
        'email'                 => 'jane@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);

    expect($response->json('user.email'))->toBe('jane@example.com');
    $this->assertDatabaseHas('users', ['email' => 'jane@example.com']);
});

it('rejects registration with duplicate email', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $response = $this->postJson('/api/register', [
        'name'                  => 'Another User',
        'email'                 => 'taken@example.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('email');
});

it('rejects registration with short password', function () {
    $response = $this->postJson('/api/register', [
        'name'                  => 'Short Pass',
        'email'                 => 'short@example.com',
        'password'              => 'short',
        'password_confirmation' => 'short',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('password');
});

it('logs in an existing user with valid credentials', function () {
    User::factory()->create([
        'email'    => 'login@example.com',
        'password' => bcrypt('correct-password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email'    => 'login@example.com',
        'password' => 'correct-password',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['user', 'token']);
});

it('rejects login with invalid credentials', function () {
    User::factory()->create([
        'email'    => 'login@example.com',
        'password' => bcrypt('correct-password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email'    => 'login@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors('email');
});

it('rejects login with non-existent email', function () {
    $response = $this->postJson('/api/login', [
        'email'    => 'nobody@example.com',
        'password' => 'whatever',
    ]);

    $response->assertStatus(422);
});

it('logs out an authenticated user', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/logout');

    $response->assertOk()
        ->assertJson(['message' => 'Logged out successfully.']);

    // Token should be revoked
    $this->assertDatabaseCount('personal_access_tokens', 0);
});

it('returns 401 for unauthenticated logout', function () {
    $response = $this->postJson('/api/logout');

    $response->assertStatus(401);
});

it('returns authenticated user details', function () {
    $user = User::factory()->create(['name' => 'Auth User']);
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/user');

    $response->assertOk()
        ->assertJson(['name' => 'Auth User']);
});
