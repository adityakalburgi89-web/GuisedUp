<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id',
    'image_path',
    'original_image_path',
    'caption',
    'has_filter',
    'image_polish_level',
    'embedding'
])]
class Post extends Model
{
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'has_filter' => 'boolean',
            'image_polish_level' => 'integer',
            // pgvector embedding can be cast to array if retrieved formatted,
            // but we can also store/retrieve it as string representation or JSON.
            // For now, casting it as a string is the safest standard.
        ];
    }

    /**
     * Get the user that owns the post.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the interactions for the post.
     */
    public function interactions(): HasMany
    {
        return $this->hasMany(Interaction::class);
    }
}
