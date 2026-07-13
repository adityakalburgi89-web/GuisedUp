<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'post_id',
    'type'
])]
class Interaction extends Model
{
    use HasFactory;

    /**
     * Get the user who made the interaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the post that was interacted with.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
