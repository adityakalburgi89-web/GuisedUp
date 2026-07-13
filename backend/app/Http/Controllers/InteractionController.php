<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'post_id' => 'required|integer|exists:posts,id',
            'type' => 'required|string|in:like,view',
        ]);

        $interaction = Interaction::create([
            'user_id' => $request->input('user_id'),
            'post_id' => $request->input('post_id'),
            'type' => $request->input('type'),
        ]);

        return response()->json($interaction, 201);
    }
}
