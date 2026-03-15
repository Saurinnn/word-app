import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const user = usePage().props.auth.user;
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        axios.get('/api/user').then(response => {
            setWordCount(response.data.word_count);
        }).catch(err => console.error(err));
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-gray-800">
                    こんにちは、{user.name}さん！
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Stats Card */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-2xl border-2 border-gray-100">
                        <div className="p-6 text-gray-900 flex items-center gap-6">
                            <div className="bg-primary/10 p-4 rounded-xl">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">登録単語数</h3>
                                <p className="text-3xl font-bold text-gray-800">{wordCount} <span className="text-base font-medium text-gray-500">語</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Word Management */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border-2 border-gray-100 p-6 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">単語管理</h3>
                            </div>
                            <p className="text-gray-600 mb-6 flex-grow">単語の登録、一覧表示、CSVによる一括アップロードができます。</p>
                            <div className="space-y-3">
                                <Link href="/words" className="block w-full text-center rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-bold uppercase tracking-widest text-neutral hover:bg-gray-50 hover:border-gray-300 transition-all active:translate-y-0.5 pointer-events-auto">単語一覧</Link>
                                <Link href="/words/create" className="block w-full text-center rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-bold uppercase tracking-widest text-neutral hover:bg-gray-50 hover:border-gray-300 transition-all active:translate-y-0.5">単語を追加</Link>
                                <Link href="/words/upload" className="block w-full text-center rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-bold uppercase tracking-widest text-neutral hover:bg-gray-50 hover:border-gray-300 transition-all active:translate-y-0.5">CSVアップロード</Link>
                            </div>
                        </div>

                        {/* Start Learning */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border-2 border-gray-100 p-6 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-primary/10 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">学習を始める</h3>
                            </div>
                            <p className="text-gray-600 mb-6 flex-grow">登録した単語からランダムに5択テストを出題します。（5単語以上の登録が必要）</p>
                            <div className="mt-auto">
                                <Link href="/test/start" className={`inline-flex justify-center w-full text-center rounded-xl border-b-4 bg-primary px-6 py-4 text-lg font-bold uppercase tracking-widest text-white transition-all ease-in-out hover:bg-primary-hover active:border-b-0 active:translate-y-1 ${wordCount < 5 ? 'opacity-50 pointer-events-none' : 'border-primary-hover hover:-translate-y-0.5'}`}>
                                    テストを開始
                                </Link>
                                {wordCount < 5 && (
                                    <p className="text-center text-sm text-error mt-3 font-medium">単語を5件以上登録してください</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
