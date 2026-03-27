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
        Schema::table('conversations', function (Blueprint $table) {
            //
    $table->unsignedBigInteger('user1')->nullable(); // Step 1: create column
    $table->unsignedBigInteger('user2')->nullable();

    $table->foreign('user1')->references('id')->on('users')->cascadeOnDelete(); // Step 2: add FK
    $table->foreign('user2')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            //
        $table->dropForeign(['user1']);
        $table->dropForeign(['user2']);
        $table->dropColumn(['user1','user2']);
        });
    }
};
