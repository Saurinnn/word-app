<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/words', function () { return Inertia::render('Words/Index'); })->name('words.index');
    Route::get('/words/create', function () { return Inertia::render('Words/Create'); })->name('words.create');
    Route::get('/words/upload', function () { return Inertia::render('Words/Upload'); })->name('words.upload');

    Route::get('/test/start', function () { return Inertia::render('Test/Start'); })->name('test.start');
    Route::get('/test/play', function () { return Inertia::render('Test/Play'); })->name('test.play');
    Route::get('/test/results', function () { return Inertia::render('Test/Results'); })->name('test.results');
});

require __DIR__.'/auth.php';
