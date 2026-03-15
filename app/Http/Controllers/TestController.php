<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\TestResult;
use App\Models\Word;
use Illuminate\Support\Str;

class TestController extends Controller
{
    public function start(Request $request)
    {
        $wordCount = $request->user()->words()->count();
        $required = 5;

        if ($wordCount >= $required) {
            return response()->json([
                'can_start' => true,
                'word_count' => $wordCount,
                'required_minimum' => $required,
                'message' => 'テストを開始できます'
            ]);
        }

        return response()->json([
            'can_start' => false,
            'word_count' => $wordCount,
            'required_minimum' => $required,
            'remaining' => $required - $wordCount,
            'message' => "単語を{$required}件以上登録してください（現在{$wordCount}件、あと" . ($required - $wordCount) . "件必要）"
        ]);
    }

    public function question(Request $request)
    {
        $userId = $request->user()->id;

        $wordCount = Word::where('user_id', $userId)->count();
        if ($wordCount < 5) {
            return response()->json(['message' => '単語が不足しています。5件以上登録してください'], 400);
        }

        $questionWord = Word::where('user_id', $userId)->inRandomOrder()->first();

        $wrongChoices = Word::where('user_id', $userId)
            ->where('id', '!=', $questionWord->id)
            ->inRandomOrder()
            ->limit(4)
            ->get(['id', 'meaning']);

        $choices = collect([
            ['choice_id' => 1, 'meaning' => $questionWord->meaning, 'is_correct' => true]
        ]);

        $choiceId = 2;
        foreach ($wrongChoices as $choice) {
            $choices->push(['choice_id' => $choiceId++, 'meaning' => $choice->meaning, 'is_correct' => false]);
        }

        $shuffledChoices = $choices->shuffle()->values();

        $frontendChoices = $shuffledChoices->map(function ($c) {
            return ['choice_id' => $c['choice_id'], 'meaning' => $c['meaning']];
        });

        return response()->json([
            'question' => [
                'word_id' => $questionWord->id,
                'word' => $questionWord->word,
            ],
            'choices' => $frontendChoices,
            'session_id' => Str::uuid()->toString(),
        ]);
    }

    public function answer(Request $request)
    {
        $request->validate([
            'word_id' => 'required|integer',
            'selected_meaning' => 'required|string',
        ]);

        $wordId = $request->word_id;
        $selectedMeaning = $request->selected_meaning;
        $userId = $request->user()->id;

        $word = Word::where('user_id', $userId)->where('id', $wordId)->firstOrFail();

        $isCorrect = ($word->meaning === $selectedMeaning);

        TestResult::create([
            'user_id' => $userId,
            'word_id' => $word->id,
            'is_correct' => $isCorrect,
            'answered_at' => now(),
        ]);

        if ($isCorrect) {
            $otherWords = Word::where('user_id', $userId)
                ->where('id', '!=', $word->id)
                ->inRandomOrder()
                ->limit(4)
                ->get(['word', 'meaning']);

            $mappings = $otherWords->map(function ($w) {
                return ['meaning' => $w->meaning, 'word' => $w->word];
            });

            return response()->json([
                'result' => 'correct',
                'is_correct' => true,
                'message' => 'おめでとう！正解！',
                'feedback' => [
                    'correct_meaning' => $word->meaning,
                    'selected_meaning' => $selectedMeaning,
                    'other_choices_with_words' => $mappings,
                ]
            ]);
        }

        return response()->json([
            'result' => 'incorrect',
            'is_correct' => false,
            'message' => '残念！不正解！',
            'feedback' => [
                'selected_meaning' => $selectedMeaning,
                'correct_meaning' => null,
                'hint' => null,
            ]
        ]);
    }

    public function results(Request $request)
    {
        $userId = $request->user()->id;
        $period = $request->input('period', 'all');

        $query = TestResult::where('user_id', $userId);

        if ($period === 'today') {
            $query->whereDate('answered_at', now()->toDateString());
        } elseif ($period === 'week') {
            $query->whereBetween('answered_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($period === 'month') {
            $query->whereBetween('answered_at', [now()->startOfMonth(), now()->endOfMonth()]);
        }

        $totalQuestions = $query->count();
        $correctAnswers = $query->clone()->where('is_correct', true)->count();
        $accuracyRate = $totalQuestions > 0 ? round($correctAnswers / $totalQuestions, 2) : 0;

        return response()->json([
            'summary' => [
                'total_questions' => $totalQuestions,
                'correct_answers' => $correctAnswers,
                'incorrect_answers' => $totalQuestions - $correctAnswers,
                'accuracy_rate' => $accuracyRate,
            ]
        ]);
    }

    public function history(Request $request)
    {
        $userId = $request->user()->id;
        $perPage = $request->input('per_page', 20);

        $history = TestResult::with('word:id,word,meaning')
            ->where('user_id', $userId)
            ->orderBy('answered_at', 'desc')
            ->paginate($perPage);

        return response()->json($history);
    }
}
