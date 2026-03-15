import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Start() {
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        axios.get('/api/user').then((res) => {
            setWordCount(res.data.word_count);
        });
    }, []);

    const canStart = wordCount >= 5;

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">テスト開始</h2>}>
            <Head title="テスト開始" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border-2 border-gray-100 p-8 text-center flex flex-col items-center">

                        <div className="bg-primary/10 p-6 rounded-full inline-block mb-6">
                            <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-4">単語学習テスト</h3>

                        <p className="text-gray-600 mb-8 max-w-md line-height-relaxed">
                            登録した単語の中からランダムに5択テストが出題されます。意味に合う単語を選択して学習を進めましょう！
                        </p>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 w-full max-w-sm">
                            <p className="font-bold text-gray-700">現在の登録単語数: <span className="text-2xl text-primary ml-2">{wordCount}</span> 語</p>
                        </div>

                        {canStart ? (
                            <Link href="/test/play" className="inline-flex justify-center w-full max-w-sm text-center rounded-xl border-b-4 border-primary-hover bg-primary px-8 py-5 text-xl font-bold uppercase tracking-widest text-white transition-all ease-in-out hover:bg-primary-hover hover:-translate-y-0.5 active:border-b-[0px] active:translate-y-1 focus:outline-none">
                                テスト開始
                            </Link>
                        ) : (
                            <div className="space-y-4 w-full max-w-sm">
                                <p className="text-error font-bold flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    テストを開始するには最低5つの単語が必要です。
                                </p>
                                <Link href="/words/create" className="inline-flex justify-center w-full text-center rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-bold uppercase tracking-widest text-neutral transition-all ease-in-out hover:bg-gray-50 active:translate-y-0.5">
                                    単語を追加する（あと {5 - wordCount} 語）
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
