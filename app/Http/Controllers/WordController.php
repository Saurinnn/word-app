<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Word;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class WordController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->words();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('word', 'like', "%{$search}%")
                  ->orWhere('meaning', 'like', "%{$search}%");
            });
        }

        $sort = $request->input('sort', 'created_desc');
        switch ($sort) {
            case 'created_asc':
                $query->orderBy('created_at', 'asc');
                break;
            case 'word_asc':
                $query->orderBy('word', 'asc');
                break;
            case 'word_desc':
                $query->orderBy('word', 'desc');
                break;
            case 'created_desc':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $perPage = $request->input('per_page', 50);
        
        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'word' => [
                'required',
                'string',
                'max:255',
                Rule::unique('words')->where(function ($query) use ($request) {
                    return $query->where('user_id', $request->user()->id);
                })
            ],
            'meaning' => ['required', 'string', 'max:1000'],
        ], [
            'word.unique' => 'この単語は既に登録されています',
        ]);

        $word = $request->user()->words()->create([
            'word' => trim($validated['word']),
            'meaning' => trim($validated['meaning']),
        ]);

        return response()->json(array_merge($word->toArray(), [
            'message' => '単語を登録しました',
        ]), 201);
    }

    public function show(Request $request, Word $word)
    {
        if ($request->user()->id !== $word->user_id) {
            return response()->json(['message' => '単語が見つかりません'], 404);
        }

        return response()->json($word);
    }

    public function update(Request $request, Word $word)
    {
        if ($request->user()->id !== $word->user_id) {
            return response()->json(['message' => '単語が見つかりません'], 404);
        }

        $validated = $request->validate([
            'word' => [
                'required',
                'string',
                'max:255',
                Rule::unique('words')->where(function ($query) use ($request) {
                    return $query->where('user_id', $request->user()->id);
                })->ignore($word->id)
            ],
            'meaning' => ['required', 'string', 'max:1000'],
        ]);

        $word->update([
            'word' => trim($validated['word']),
            'meaning' => trim($validated['meaning']),
        ]);

        return response()->json(array_merge($word->toArray(), [
            'message' => '単語を更新しました',
        ]));
    }

    public function destroy(Request $request, Word $word)
    {
        if ($request->user()->id !== $word->user_id) {
            return response()->json(['message' => '単語が見つかりません'], 404);
        }

        $word->delete();

        return response()->json(['message' => '単語を削除しました']);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ]);

        $overwrite = $request->boolean('overwrite');
        $file = $request->file('file');
        
        $content = file_get_contents($file->getRealPath());
        $content = mb_convert_encoding($content, 'UTF-8', 'UTF-8, SJIS-win, SJIS, EUC-JP');
        
        $lines = explode("\n", str_replace(["\r\n", "\r"], "\n", $content));
        
        if (count($lines) < 2) {
            return response()->json(['message' => 'CSVファイルの形式が正しくありません'], 422);
        }
        
        $headers = str_getcsv(array_shift($lines));
        if (trim($headers[0]) !== '単語' || trim($headers[1] ?? '') !== '意味') {
            return response()->json(['message' => 'ヘッダーの形式が正しくありません'], 422);
        }

        $errors = [];
        $registered = 0;
        $updated = 0;
        $skipped = 0;
        $rowNumber = 2; // header is 1
        
        $userId = $request->user()->id;

        DB::beginTransaction();
        try {
            foreach ($lines as $line) {
                if (trim($line) === '') {
                    $rowNumber++;
                    continue;
                }
                
                $row = str_getcsv($line);
                $wordStr = trim($row[0] ?? '');
                $meaning = trim($row[1] ?? '');
                
                if ($wordStr === '') {
                    $errors[] = ['row' => $rowNumber, 'field' => '単語', 'value' => $wordStr, 'message' => '単語が空です'];
                    $rowNumber++;
                    continue;
                }
                if (mb_strlen($wordStr) > 255) {
                    $errors[] = ['row' => $rowNumber, 'field' => '単語', 'value' => $wordStr, 'message' => '単語は255文字以内で入力してください'];
                }
                if ($meaning === '') {
                    $errors[] = ['row' => $rowNumber, 'field' => '意味', 'value' => $meaning, 'message' => '意味が空です'];
                }
                if (mb_strlen($meaning) > 1000) {
                    $errors[] = ['row' => $rowNumber, 'field' => '意味', 'value' => $meaning, 'message' => '意味は1000文字以内で入力してください'];
                }

                if (!empty($errors)) {
                    $rowNumber++;
                    continue;
                }

                $existing = Word::where('user_id', $userId)->where('word', $wordStr)->first();
                if ($existing) {
                    if ($overwrite) {
                        $existing->update(['meaning' => $meaning]);
                        $updated++;
                    } else {
                        $skipped++;
                    }
                } else {
                    Word::create([
                        'user_id' => $userId,
                        'word' => $wordStr,
                        'meaning' => $meaning,
                    ]);
                    $registered++;
                }
                
                $rowNumber++;
            }

            if (!empty($errors)) {
                DB::rollBack();
                return response()->json([
                    'message' => 'CSVバリデーションエラー',
                    'errors' => $errors,
                ], 422);
            }

            DB::commit();

            return response()->json([
                'message' => 'CSVアップロード完了',
                'summary' => [
                    'total_rows' => $registered + $updated + $skipped,
                    'registered' => $registered,
                    'updated' => $updated,
                    'skipped' => $skipped,
                    'errors' => [],
                ]
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => '処理中にエラーが発生しました'], 500);
        }
    }
}
