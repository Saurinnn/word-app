import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import WordForm from '@/Components/WordForm';
import axios from 'axios';
import { useState } from 'react';

export default function Create() {
    const { data, setData } = useForm({
        word: '',
        meaning: '',
    });

    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
    const [processing, setProcessing] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        axios.post('/api/words', data)
            .then(() => {
                router.visit('/words');
            })
            .catch((err) => {
                if (err.response && err.response.data.errors) {
                    const errorMsgs: any = {};
                    Object.keys(err.response.data.errors).forEach(key => {
                        errorMsgs[key] = err.response.data.errors[key][0];
                    });
                    setErrors(errorMsgs);
                } else if (err.response && err.response.data.message) {
                    alert(err.response.data.message);
                }
                setProcessing(false);
            });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">単語の追加</h2>}>
            <Head title="単語追加" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border-2 border-gray-100 p-6 sm:p-8">
                        <WordForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            onSubmit={submit}
                            onCancel={() => router.visit('/words')}
                            submitText="追加する"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
