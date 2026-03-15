import { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';

interface WordFormProps {
    data: { word: string; meaning: string };
    setData: (field: string, value: string) => void;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    onSubmit: FormEventHandler;
    onCancel: () => void;
    submitText?: string;
}

export default function WordForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    onCancel,
    submitText = '登録'
}: WordFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <InputLabel htmlFor="word" value="単語" />
                <TextInput
                    id="word"
                    type="text"
                    name="word"
                    value={data.word}
                    className="mt-1 block w-full rounded-xl border-2 border-gray-200 p-3 focus:border-primary focus:ring-primary transition-colors"
                    placeholder="例: apple, 猫, 사과, 苹果, manzana"
                    maxLength={255}
                    autoComplete="off"
                    isFocused={true}
                    onChange={(e) => setData('word', e.target.value)}
                    required
                />
                <InputError message={errors.word} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="meaning" value="意味" />
                <textarea
                    id="meaning"
                    name="meaning"
                    value={data.meaning}
                    className="mt-1 block w-full rounded-xl border-2 border-gray-200 p-3 shadow-sm focus:border-primary focus:ring-primary transition-colors resize-none"
                    placeholder="例: りんご"
                    maxLength={1000}
                    rows={3}
                    onChange={(e) => setData('meaning', e.target.value)}
                    required
                />
                <InputError message={errors.meaning} className="mt-2" />
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>{submitText}</PrimaryButton>
                <SecondaryButton onClick={onCancel} disabled={processing}>
                    キャンセル
                </SecondaryButton>
            </div>
        </form>
    );
}
