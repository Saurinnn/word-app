import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Word {
    id: number;
    word: string;
    meaning: string;
    created_at: string;
}

export default function Index() {
    const [words, setWords] = useState<Word[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWords = () => {
        setLoading(true);
        axios.get('/api/words?sort=created_desc&per_page=100').then((res) => {
            setWords(res.data.data || res.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchWords();
    }, []);

    const handleDelete = (id: number) => {
        if (confirm('本当に削除しますか？')) {
            axios.delete(`/api/words/${id}`).then(() => {
                fetchWords();
            });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">単語一覧</h2>}>
            <Head title="単語一覧" />
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border-2 border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800 border-b-4 border-primary pb-2 inline-block">登録済み単語 ({words.length})</h3>
                            <div className="flex gap-3">
                                <Link href="/words/upload" className="inline-flex items-center px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-bold text-xs text-neutral tracking-widest hover:bg-gray-50 hover:-translate-y-0.5 transition-all active:translate-y-0.5">CSVアップロード</Link>
                                <Link href="/words/create" className="inline-flex items-center px-4 py-2 bg-primary border-b-4 border-primary-hover rounded-xl font-bold text-xs text-white tracking-widest hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-0 transition-all">単語を追加</Link>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-gray-500 font-bold">読み込み中...</div>
                        ) : words.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-500 font-medium">まだ単語が登録されていません。</p>
                                <div className="mt-4">
                                    <Link href="/words/create" className="text-primary font-bold hover:underline">最初の単語を登録する</Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-gray-100">
                                            <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">単語</th>
                                            <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">意味</th>
                                            <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {words.map((word) => (
                                            <tr key={word.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4 font-bold text-gray-800 text-lg w-1/3 break-all">{word.word}</td>
                                                <td className="py-4 px-4 text-gray-600 w-1/2 break-all">{word.meaning}</td>
                                                <td className="py-4 px-4 text-right space-x-2 w-24">
                                                    <button onClick={() => handleDelete(word.id)} className="text-sm font-bold text-error uppercase hover:underline p-2 rounded-lg hover:bg-red-50 transition-colors">削除</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
