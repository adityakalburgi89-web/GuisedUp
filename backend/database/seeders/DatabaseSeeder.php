<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use App\Models\Interaction;
use App\Models\Follow;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create two test users
        $alice = User::factory()->create([
            'name' => 'Alice Smith',
            'email' => 'alice@example.com',
            'password' => bcrypt('password'),
        ]);

        $bob = User::factory()->create([
            'name' => 'Bob Jones',
            'email' => 'bob@example.com',
            'password' => bcrypt('password'),
        ]);

        $users = [$alice, $bob];

        // 2. Create 20 posts with deterministic normalized 384-dimensional embeddings
        $posts = [];
        for ($postId = 1; $postId <= 20; $postId++) {
            $author = $users[($postId % 2)]; // Alternates between Alice and Bob
            
            // Generate deterministic 384-dimension vector
            $embedding = [];
            for ($i = 0; $i < 384; $i++) {
                $embedding[] = sin($postId + $i) * cos($postId - $i);
            }
            // Normalize vector to unit length
            $magnitude = sqrt(array_sum(array_map(fn($x) => $x * $x, $embedding)));
            $normalized = array_map(fn($x) => $x / ($magnitude ?: 1.0), $embedding);
            $vectorString = '[' . implode(',', $normalized) . ']';

            $post = Post::create([
                'user_id' => $author->id,
                'image_path' => "/images/posts/post_{$postId}.jpg",
                'original_image_path' => "/images/posts/original_{$postId}.jpg",
                'caption' => "This is awesome post #{$postId} about photography and neural networks!",
                'has_filter' => ($postId % 3 === 0),
                'image_polish_level' => ($postId % 5) * 2, // 0, 2, 4, 6, 8
            ]);

            // Save raw vector using raw SQL statement to respect pgvector
            DB::statement(
                'UPDATE posts SET embedding = ?::vector WHERE id = ?',
                [$vectorString, $post->id]
            );

            // Fetch the updated post to keep in memory
            $posts[] = Post::find($post->id);
        }

        // 3. Create self-referencing follows (mutual follow)
        Follow::create([
            'follower_id' => $alice->id,
            'following_id' => $bob->id,
        ]);

        Follow::create([
            'follower_id' => $bob->id,
            'following_id' => $alice->id,
        ]);

        // 4. Create interactions (likes and views)
        foreach ($posts as $index => $post) {
            // Alice interacts with Bob's posts and Bob interacts with Alice's posts
            if ($post->user_id === $alice->id) {
                // Bob views Alice's post
                Interaction::create([
                    'user_id' => $bob->id,
                    'post_id' => $post->id,
                    'type' => 'view',
                ]);

                // Bob likes every even post of Alice
                if ($index % 2 === 0) {
                    Interaction::create([
                        'user_id' => $bob->id,
                        'post_id' => $post->id,
                        'type' => 'like',
                    ]);
                }
            } else {
                // Alice views Bob's post
                Interaction::create([
                    'user_id' => $alice->id,
                    'post_id' => $post->id,
                    'type' => 'view',
                ]);

                // Alice likes every odd post of Bob
                if ($index % 2 !== 0) {
                    Interaction::create([
                        'user_id' => $alice->id,
                        'post_id' => $post->id,
                        'type' => 'like',
                    ]);
                }
            }
        }
    }
}
