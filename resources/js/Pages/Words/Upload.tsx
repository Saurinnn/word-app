import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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

    // Prevent default drag & drop behavior globally on this page to stop the browser from opening/downloading dropped files
    useEffect(() => {
        const preventDefault = (e: DragEvent) => {
            e.preventDefault();
        };
        window.addEventListener('dragover', preventDefault);
        window.addEventListener('drop', preventDefault);
        return () => {
            window.removeEventListener('dragover', preventDefault);
            window.removeEventListener('drop', preventDefault);
        };
    }, []);

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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles[0]) {
            setFile(acceptedFiles[0]);
            setError('');
        }
    }, []);

    const onDropRejected = useCallback(() => {
        setError('CSVファイルのみアップロード可能です');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv'],
            'application/csv': ['.csv'],
        },
        multiple: false
    });

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
                                    <div
                                        {...getRootProps()}
                                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                                            isDragActive
                                                ? 'border-primary bg-blue-50/50'
                                                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary'
                                        }`}
                                    >
                                        <input {...getInputProps()} />
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                            {isDragActive ? (
                                                <p className="mb-2 text-sm text-primary font-semibold">ここにファイルをドロップしてください...</p>
                                            ) : (
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">クリックして選択</span> またはドラッグ＆ドロップ</p>
                                            )}
                                            <p className="text-xs text-gray-500">CSV (最大 5MB)</p>
                                            {file && <p className="mt-4 text-sm font-bold text-primary">{file.name}</p>}
                                        </div>
                                    </div>
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
