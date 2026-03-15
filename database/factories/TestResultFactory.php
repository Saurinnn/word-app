<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TestResult>
 */
class TestResultFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'word_id' => \App\Models\Word::factory(),
            'is_correct' => $this->faker->boolean(70),
            'answered_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
