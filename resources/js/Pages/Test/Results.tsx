import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Summary {
    total_questions: number;
    correct_answers: number;
    incorrect_answers: number;
    accuracy_rate: number;
}

interface HistoryItem {
    id: number;
    word_id: number;
    is_correct: boolean;
    answered_at: string;
    word: {
        id: number;
        word: string;
        meaning: string;
    };
}

export default function Results() {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all');

    const fetchData = () => {
        setLoading(true);
        Promise.all([
            axios.get(`/api/test/results?period=${period}`),
            axios.get('/api/test/history?per_page=50')
        ]).then(([resSummary, resHistory]) => {
            setSummary(resSummary.data.summary);
            setHistory(resHistory.data.data || resHistory.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, [period]);

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">学習記録</h2>}>
            <Head title="学習記録" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">

                    {/* Period Selector */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border-2 border-gray-100 p-4 flex justify-between items-center sm:flex-row flex-col gap-4">
                        <h3 className="text-lg font-bold text-gray-800">成績サマリー</h3>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            {(['today', 'week', 'month', 'all'] as const).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${period === p ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {p === 'today' ? '今日' : p === 'week' ? '今週' : p === 'month' ? '今月' : '全期間'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats Grid */}
                    {summary && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 text-center">
                                <p className="text-sm font-bold text-gray-500 mb-1 tracking-wider">解答数</p>
                                <p className="text-3xl font-extrabold text-gray-800">{summary.total_questions}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border-2 border-green-100 text-center">
                                <p className="text-sm font-bold text-green-600 mb-1 tracking-wider">正解数</p>
                                <p className="text-3xl font-extrabold text-green-500">{summary.correct_answers}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border-2 border-red-100 text-center">
                                <p className="text-sm font-bold text-red-600 mb-1 tracking-wider">不正解数</p>
                                <p className="text-3xl font-extrabold text-red-500">{summary.incorrect_answers}</p>
                            </div>
                            <div className="bg-primary text-white p-6 rounded-2xl border-2 border-primary-hover text-center shadow-[0_4px_0_0_#46A302]">
                                <p className="text-sm font-bold text-white/90 mb-1 tracking-wider">正答率</p>
                                <p className="text-3xl font-extrabold">{Math.round(summary.accuracy_rate * 100)}%</p>
                            </div>
                        </div>
                    )}

                    {/* History Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border-2 border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-800 border-b-4 border-primary pb-2 inline-block mb-6">最近の解答履歴</h3>

                        {loading ? (
                            <div className="text-center py-10 font-bold text-gray-500">読み込み中...</div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 font-medium">まだ履歴がありません。テストをプレイしてみましょう！</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-gray-100">
                                            <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">日時</th>
                                            <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">単語</th>
                                            <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">意味</th>
                                            <th className="py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">結果</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {history.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm text-gray-500">{new Date(item.answered_at).toLocaleString('ja-JP')}</td>
                                                <td className="py-3 px-4 font-bold text-gray-800">{item.word?.word}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{item.word?.meaning}</td>
                                                <td className="py-3 px-4 text-center">
                                                    {item.is_correct ? (
                                                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-green-100 text-green-700 font-bold text-xs">正解</span>
                                                    ) : (
                                                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-xs">不正解</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="mt-8 text-center">
                            <Link href="/test/start" className="inline-flex justify-center text-center rounded-xl border-b-4 border-primary-hover bg-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all ease-in-out hover:bg-primary-hover hover:-translate-y-0.5 active:border-b-[0px] active:translate-y-1">
                                もう一度テストをする
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
