import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TestChoice from '@/Components/TestChoice';

interface Choice {
    choice_id: number;
    meaning: string;
}

interface QuestionData {
    question: {
        word_id: number;
        word: string;
    };
    choices: Choice[];
    session_id: string;
}

export default function Play() {
    const [questionData, setQuestionData] = useState<QuestionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Result state
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [feedback, setFeedback] = useState<any>(null);
    const [correctChoiceId, setCorrectChoiceId] = useState<number | null>(null);

    const loadQuestion = () => {
        setLoading(true);
        setShowResult(false);
        setSelectedChoiceId(null);
        setIsCorrect(null);
        setFeedback(null);
        setCorrectChoiceId(null);

        axios.get('/api/test/question').then(res => {
            setQuestionData(res.data);
            setLoading(false);
        }).catch(err => {
            alert('問題の取得に失敗しました。単語が不足している可能性があります。');
            router.visit('/test/start');
        });
    };

    useEffect(() => {
        loadQuestion();
    }, []);

    const handleSelect = (choice: Choice) => {
        if (showResult || isSubmitting) return;
        setSelectedChoiceId(choice.choice_id);
    };

    const handleCheck = () => {
        if (!selectedChoiceId || !questionData || isSubmitting) return;

        setIsSubmitting(true);
        const selectedChoice = questionData.choices.find(c => c.choice_id === selectedChoiceId);

        axios.post('/api/test/answer', {
            word_id: questionData.question.word_id,
            selected_meaning: selectedChoice?.meaning,
        }).then(res => {
            setIsSubmitting(false);
            setShowResult(true);
            setIsCorrect(res.data.is_correct);
            setFeedback(res.data.feedback);

            if (!res.data.is_correct && res.data.feedback.correct_meaning) {
                const correct = questionData.choices.find(c => c.meaning === res.data.feedback.correct_meaning);
                if (correct) {
                    setCorrectChoiceId(correct.choice_id);
                }
            } else if (res.data.is_correct) {
                setCorrectChoiceId(selectedChoiceId);
            }
        }).catch(err => {
            alert('エラーが発生しました');
            setIsSubmitting(false);
        });
    };

    if (loading) {
        return (
            <AuthenticatedLayout header={<h2 className="text-xl font-bold text-gray-800">学習中...</h2>}>
                <Head title="テストプレイ" />
                <div className="py-20 text-center text-gray-500 font-bold text-xl">問題を準備しています...</div>
            </AuthenticatedLayout>
        );
    }

    if (!questionData) return null;

    const bottomBarClass = showResult
        ? (isCorrect ? 'bg-green-100 border-t-2 border-green-200' : 'bg-red-100 border-t-2 border-red-200')
        : 'bg-white border-t-2 border-gray-200';

    return (
        <AuthenticatedLayout>
            <Head title="テストプレイ" />

            <div className="flex flex-col min-h-[calc(100vh-65px)] bg-white relative">
                <main className="flex-grow flex flex-col items-center pt-8 pb-40 px-4 sm:px-6 w-full max-w-3xl mx-auto">

                    <div className="w-full flex justify-between items-center mb-8">
                        <Link href="/test/start" className="text-gray-400 hover:text-gray-600 p-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </Link>
                        <div className="flex-grow mx-8">
                            <div className="h-4 bg-gray-200 rounded-full overflow-hidden w-full">
                                <div className="h-full bg-primary rounded-full w-full opacity-50 transition-all duration-300"></div>
                            </div>
                        </div>
                        <Link href="/test/results" className="text-gray-400 hover:text-primary font-bold flex items-center gap-1 transition-colors">
                            終了する
                        </Link>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 self-start mb-6">次の単語の意味は？</h1>

                    <div className="text-4xl sm:text-5xl font-extrabold text-[#3C3C3C] mb-12 py-8 text-center break-all w-full">
                        {questionData.question.word}
                    </div>

                    <div className="w-full grid grid-cols-1 gap-4 mt-auto">
                        {questionData.choices.map((choice) => {
                            let state: 'default' | 'correct' | 'incorrect' = 'default';

                            if (showResult) {
                                if (choice.choice_id === correctChoiceId) {
                                    state = 'correct';
                                } else if (choice.choice_id === selectedChoiceId && !isCorrect) {
                                    state = 'incorrect';
                                }
                            }

                            const isSelected = selectedChoiceId === choice.choice_id;

                            return (
                                <TestChoice
                                    key={choice.choice_id}
                                    state={state}
                                    onClick={() => handleSelect(choice)}
                                    disabled={showResult}
                                    className={!showResult && isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2' : ''}
                                >
                                    {choice.meaning}
                                </TestChoice>
                            );
                        })}
                    </div>
                </main>

                <div className={`fixed bottom-0 left-0 right-0 p-4 sm:p-6 transition-colors duration-300 flex justify-center z-10 ${bottomBarClass}`}>
                    <div className="w-full max-w-3xl flex items-center justify-between">
                        {showResult ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`rounded-full p-2 ${isCorrect ? 'bg-white text-green-500' : 'bg-white text-red-500'}`}>
                                        {isCorrect ? (
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-extrabold pb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                            {isCorrect ? '正解！' : '不正解'}
                                        </h3>
                                    </div>
                                </div>
                                <button
                                    onClick={loadQuestion}
                                    className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-lg transition-all active:translate-y-1 ${isCorrect
                                            ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302] hover:bg-[#46A302]'
                                            : 'bg-[#FF4B4B] text-white border-b-4 border-[#EA2B2B] hover:bg-[#EA2B2B]'
                                        }`}
                                >
                                    次へ
                                </button>
                            </div>
                        ) : (
                            <div className="w-full flex justify-end">
                                <button
                                    onClick={handleCheck}
                                    disabled={!selectedChoiceId || isSubmitting}
                                    className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-lg transition-all ${selectedChoiceId
                                            ? 'bg-primary text-white border-b-4 border-primary-hover active:border-b-0 active:translate-y-1 hover:-translate-y-0.5'
                                            : 'bg-gray-200 text-gray-400 border-b-4 border-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    答え合わせ
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
