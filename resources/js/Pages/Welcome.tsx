import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="単語学習アプリ - 楽しく効率的に語彙力をアップ！" />
            <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-[#58cc02]/30 selection:text-[#46a302]">
                
                {/* Header Navigation */}
                <header className="sticky top-0 z-50 bg-white border-b-2 border-gray-100 px-6 py-4 md:px-12">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            {/* Cute Mini Owl SVG */}
                            <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="50" cy="55" rx="35" ry="38" fill="#58cc02" />
                                <ellipse cx="50" cy="62" rx="22" ry="24" fill="#a5ed6e" />
                                <circle cx="36" cy="40" r="14" fill="white" stroke="#46a302" strokeWidth="3" />
                                <circle cx="64" cy="40" r="14" fill="white" stroke="#46a302" strokeWidth="3" />
                                <circle cx="38" cy="40" r="6" fill="#1b1b1b" />
                                <circle cx="62" cy="40" r="6" fill="#1b1b1b" />
                                <path d="M50 45L45 52L55 52Z" fill="#ff9600" />
                                <circle cx="40" cy="92" r="5" fill="#ff9600" />
                                <circle cx="60" cy="92" r="5" fill="#ff9600" />
                            </svg>
                            <span className="text-2xl font-extrabold text-[#58cc02] tracking-wide hidden sm:inline">
                                単語学習アプリ
                            </span>
                        </div>

                        {/* Navigation Right */}
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-6 py-2.5 bg-[#58cc02] hover:bg-[#46a302] text-white text-sm font-extrabold rounded-2xl shadow-[0_4px_0_#46a302] active:translate-y-1 active:shadow-none border-b-2 border-[#46a302] transition-all"
                                >
                                    ダッシュボード
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-6 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-extrabold border-2 border-gray-200 rounded-2xl hover:bg-gray-50 active:translate-y-0.5 transition-all"
                                    >
                                        ログイン
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-6 py-2.5 bg-[#58cc02] hover:bg-[#46a302] text-white text-sm font-extrabold rounded-2xl shadow-[0_4px_0_#46a302] active:translate-y-1 active:shadow-none border-b-2 border-[#46a302] transition-all hidden md:inline-block"
                                    >
                                        スタートする
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main>
                    <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
                        
                        {/* Left: Owl Mascot and Speech Bubble */}
                        <div className="flex flex-col items-center text-center">
                            {/* Speech Bubble */}
                            <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm max-w-xs text-center mb-6 font-extrabold text-gray-700 border-b-4 border-gray-200">
                                <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-gray-200 transform rotate-45"></div>
                                こんにちは！一緒に英単語を楽しく勉強しましょう！🚀
                            </div>

                            {/* Cute Owl SVG Mascot */}
                            <div className="relative group">
                                <svg className="w-56 h-56 sm:w-72 sm:h-72 transition-transform duration-500 group-hover:scale-105" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Body */}
                                    <ellipse cx="50" cy="55" rx="35" ry="38" fill="#58cc02" />
                                    {/* Belly */}
                                    <ellipse cx="50" cy="62" rx="22" ry="24" fill="#a5ed6e" />
                                    {/* Belly feathers */}
                                    <path d="M42 58L45 61L48 58" stroke="#58cc02" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M52 58L55 61L58 58" stroke="#58cc02" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M47 66L50 69L53 66" stroke="#58cc02" strokeWidth="2.5" strokeLinecap="round" />
                                    {/* Ears */}
                                    <path d="M22 28L15 42L28 35Z" fill="#58cc02" />
                                    <path d="M78 28L85 42L72 35Z" fill="#58cc02" />
                                    {/* Eyes */}
                                    <circle cx="36" cy="40" r="14" fill="white" stroke="#46a302" strokeWidth="3" />
                                    <circle cx="64" cy="40" r="14" fill="white" stroke="#46a302" strokeWidth="3" />
                                    {/* Pupils */}
                                    <circle cx="38" cy="40" r="6" fill="#1b1b1b" />
                                    <circle cx="62" cy="40" r="6" fill="#1b1b1b" />
                                    {/* Pupil Highlights */}
                                    <circle cx="36" cy="38" r="2" fill="white" />
                                    <circle cx="60" cy="38" r="2" fill="white" />
                                    {/* Beak */}
                                    <path d="M50 45L45 52L55 52Z" fill="#ff9600" />
                                    {/* Feet */}
                                    <circle cx="40" cy="92" r="5" fill="#ff9600" />
                                    <circle cx="60" cy="92" r="5" fill="#ff9600" />
                                    {/* Wings */}
                                    <path d="M12 55C8 55 6 65 14 70C20 74 22 68 20 60Z" fill="#46a302" />
                                    <path d="M88 55C92 55 94 65 86 70C80 74 78 68 80 60Z" fill="#46a302" />
                                </svg>
                            </div>
                        </div>

                        {/* Right: Pitch & Call to Action (Buttons) */}
                        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                                楽しく、効果的に。<br />
                                <span className="text-[#58cc02]">英語の単語</span>を学ぼう！
                            </h1>
                            <p className="mt-6 text-lg text-gray-500 font-semibold max-w-md">
                                ゲーム感覚でサクサク進む！ポイントを集めながら、毎日の習慣として単語が自然に身につきます。
                            </p>

                            {/* Call to Actions */}
                            <div className="mt-8 w-full flex flex-col sm:flex-row md:flex-col gap-4 items-center md:items-start">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="w-full max-w-sm py-4 bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold rounded-2xl shadow-[0_4px_0_#46a302] active:translate-y-1 active:shadow-none border-b-2 border-[#46a302] transition-all text-center tracking-wider text-lg"
                                    >
                                        学習を再開する
                                    </Link>
                                ) : (
                                    <>
                                        {/* Register / Get Started */}
                                        <Link
                                            href={route('register')}
                                            className="w-full max-w-sm py-4 bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold rounded-2xl shadow-[0_4px_0_#46a302] active:translate-y-1 active:shadow-none border-b-2 border-[#46a302] transition-all text-center tracking-wider text-lg"
                                        >
                                            スタートする
                                        </Link>
                                        {/* Login / Already have account */}
                                        <Link
                                            href={route('login')}
                                            className="w-full max-w-sm py-4 bg-white hover:bg-gray-50 text-[#1cb0f6] border-2 border-b-4 border-gray-200 hover:border-b-2 hover:translate-y-0.5 active:translate-y-1 active:border-b-2 transition-all text-center tracking-wider font-extrabold text-lg"
                                        >
                                            すでにアカウントを持っています
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                    </section>

                    {/* Features Grid */}
                    <section className="bg-gray-50 border-t-2 border-gray-100 py-16 md:py-24">
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-12 md:mb-16">
                                単語学習アプリが選ばれる理由
                            </h2>
                            
                            <div className="grid md:grid-cols-3 gap-8">
                                
                                {/* Feature 1 */}
                                <div className="bg-white border-2 border-gray-200 border-b-4 rounded-3xl p-8 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-[#ff9600]/10 rounded-2xl flex items-center justify-center mb-6">
                                        <svg className="w-10 h-10 text-[#ff9600]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-extrabold text-gray-900 mb-3">ゲーム感覚のレッスン</h3>
                                    <p className="text-gray-500 font-semibold text-sm leading-relaxed">
                                        クイズを解くたびに経験値を獲得！ゲーム感覚で楽しくレベルアップしながら、毎日無理なく続けられます。
                                    </p>
                                </div>

                                {/* Feature 2 */}
                                <div className="bg-white border-2 border-gray-200 border-b-4 rounded-3xl p-8 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-[#1cb0f6]/10 rounded-2xl flex items-center justify-center mb-6">
                                        <svg className="w-10 h-10 text-[#1cb0f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-extrabold text-gray-900 mb-3">科学的な復習システム</h3>
                                    <p className="text-gray-500 font-semibold text-sm leading-relaxed">
                                        記憶の忘却曲線に基づき、間違えやすい苦手な単語を最適なタイミングで再出題。記憶への定着度を最大化します。
                                    </p>
                                </div>

                                {/* Feature 3 */}
                                <div className="bg-white border-2 border-gray-200 border-b-4 rounded-3xl p-8 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-[#58cc02]/10 rounded-2xl flex items-center justify-center mb-6">
                                        <svg className="w-10 h-10 text-[#58cc02]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-extrabold text-gray-900 mb-3">1回3分のスキマ時間</h3>
                                    <p className="text-gray-500 font-semibold text-sm leading-relaxed">
                                        通学・通勤や休憩中などのちょっとした時間にサクッと学習。場所を選ばずいつでも手軽にボキャブラリーを鍛えられます。
                                    </p>
                                </div>

                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t-2 border-gray-100 py-12 text-center text-sm font-bold text-gray-400">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p>© 2026 単語学習アプリ. All rights reserved.</p>
                        <p className="text-xs font-semibold">Laravel v{laravelVersion} (PHP v{phpVersion})</p>
                    </div>
                </footer>

            </div>
        </>
    );
}
