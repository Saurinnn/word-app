<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::post('/words/upload', [App\Http\Controllers\WordController::class, 'upload']);
    Route::apiResource('words', App\Http\Controllers\WordController::class);

    Route::get('/test/start', [App\Http\Controllers\TestController::class, 'start']);
    Route::get('/test/question', [App\Http\Controllers\TestController::class, 'question']);
    Route::post('/test/answer', [App\Http\Controllers\TestController::class, 'answer']);
    Route::get('/test/results', [App\Http\Controllers\TestController::class, 'results']);
    Route::get('/test/history', [App\Http\Controllers\TestController::class, 'history']);
});
