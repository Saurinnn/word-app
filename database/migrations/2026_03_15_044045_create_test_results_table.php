<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('test_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete()->comment('ユーザーID');
            $table->foreignId('word_id')->constrained()->cascadeOnDelete()->comment('出題された単語ID');
            $table->boolean('is_correct')->comment('TRUE=正解, FALSE=不正解');
            $table->timestamp('answered_at')->useCurrent()->comment('回答日時');
            
            $table->index('answered_at');
            $table->index(['user_id', 'answered_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_results');
    }
};
