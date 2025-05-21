<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('surname', length: 100)->charset('utf8mb4')->nullable();
            $table->string('name', length: 100)->charset('utf8mb4')->nullable(false);
            $table->string('last_name', length: 100)->charset('utf8mb4')->nullable();
            $table->string('email', length: 50)->charset('utf8mb4')->nullable();
            $table->string('phone', length: 20)->nullable();
            $table->unsignedTinyInteger('birth_day')->nullable();
            $table->unsignedTinyInteger('birth_month')->nullable();
            $table->unsignedSmallInteger('birth_year')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
