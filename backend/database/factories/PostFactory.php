<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'             => User::factory(),
            'image_path'          => '/images/posts/post_' . $this->faker->unique()->numberBetween(1, 10000) . '.jpg',
            'original_image_path' => '/images/posts/original_' . $this->faker->numberBetween(1, 10000) . '.jpg',
            'caption'             => $this->faker->sentence(8),
            'has_filter'          => $this->faker->boolean(30),
            'image_polish_level'  => $this->faker->numberBetween(0, 10),
        ];
    }

    /**
     * Indicate the post has a filter applied.
     */
    public function filtered(): static
    {
        return $this->state(fn (array $attributes) => [
            'has_filter' => true,
        ]);
    }

    /**
     * Indicate the post has no caption.
     */
    public function withoutCaption(): static
    {
        return $this->state(fn (array $attributes) => [
            'caption' => null,
        ]);
    }
}
