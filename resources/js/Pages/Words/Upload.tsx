import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';

export default function Upload() {
    const [file, setFile] = useState<File | null>(null);
    const [overwrite, setOverwrite] = useState(false);
    const [error, setError] = useState<string>('');
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError('ファイルを選択してください');
            return;
        }

        setProcessing(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('overwrite', overwrite ? '1' : '0');

        axios.post('/api/words/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => {
            alert(res.data.message + `\n登録: ${res.data.summary.registered}件, 更新: ${res.data.summary.updated}件`);
            router.visit('/words');
        }).catch((err) => {
            if (err.response && err.response.data.errors) {
                const msgs = err.response.data.errors.map((e: any) => `行 ${e.row}: ${e.message}`).join('\n');
                alert(err.response.data.message + '\n' + msgs);
            } else if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('エラーが発生しました');
            }
            setProcessing(false);
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">CSVアップロード</h2>}>
            <Head title="CSVアップロード" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border-2 border-gray-100 p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel value="CSVファイル" />
                                <div className="mt-2 flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">クリックして選択</span> またはドラッグ＆ドロップ</p>
                                            <p className="text-xs text-gray-500">CSV (最大 5MB)</p>
                                            {file && <p className="mt-4 text-sm font-bold text-primary">{file.name}</p>}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            id="dropzone-file"
                                            type="file"
                                            className="hidden"
                                            accept=".csv,text/csv"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFile(e.target.files[0]);
                                                    setError('');
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                <InputError message={error} className="mt-2" />
                            </div>

                            <div className="flex items-center mt-4">
                                <input
                                    id="overwrite"
                                    type="checkbox"
                                    className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                                    checked={overwrite}
                                    onChange={(e) => setOverwrite(e.target.checked)}
                                />
                                <label htmlFor="overwrite" className="ml-2 text-sm font-medium text-gray-900">
                                    既存の単語がある場合は意味を上書きする
                                </label>
                            </div>

                            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
                                <p className="font-bold mb-1">CSVフォーマット:</p>
                                <p>1行目（ヘッダー）: 単語, 意味</p>
                                <p>2行目以降: apple, りんご</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing || !file}>アップロード</PrimaryButton>
                                <SecondaryButton type="button" onClick={() => router.visit('/words')} disabled={processing}>キャンセル</SecondaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
