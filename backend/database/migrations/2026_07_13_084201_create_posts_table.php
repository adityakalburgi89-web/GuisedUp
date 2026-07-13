<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('image_path');
            $table->string('original_image_path')->nullable();
            $table->text('caption')->nullable();
            $table->boolean('has_filter')->default(false);
            $table->integer('image_polish_level')->default(0);
            $table->timestamps();

            $table->index('created_at');
        });

        // Add pgvector column of size 384 using raw SQL as instructed
        DB::statement('ALTER TABLE posts ADD COLUMN embedding vector(384) NULL;');
        
        // Create HNSW index on the embedding vector column
        DB::statement('CREATE INDEX posts_embedding_hnsw_idx ON posts USING hnsw (embedding vector_l2_ops);');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
