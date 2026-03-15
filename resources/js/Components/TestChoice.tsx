import { ButtonHTMLAttributes, ReactNode } from 'react';

interface TestChoiceProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    state?: 'default' | 'correct' | 'incorrect';
    children: ReactNode;
}

export default function TestChoice({
    state = 'default',
    className = '',
    disabled,
    children,
    ...props
}: TestChoiceProps) {
    let stateStyles = '';

    if (state === 'default') {
        stateStyles = 'border-gray-200 text-gray-700 hover:border-primary hover:bg-gray-50 bg-white';
    } else if (state === 'correct') {
        stateStyles = 'border-success bg-success text-white shadow-[0_4px_0_0_#43A047]';
    } else if (state === 'incorrect') {
        stateStyles = 'border-error bg-error text-white shadow-[0_4px_0_0_#E53935] opacity-80';
    }

    return (
        <button
            {...props}
            className={`w-full px-5 py-4 flex items-center justify-between rounded-xl border-2 transition-all duration-200 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${stateStyles} ${disabled && state === 'default' ? 'opacity-50 cursor-not-allowed' : ''
                } ${state === 'default' && !disabled ? 'active:translate-y-1 active:border-b-2 hover:-translate-y-0.5 border-b-4 hover:border-primary' : ''} ${className}`}
            disabled={disabled}
        >
            <span className="font-medium text-lg">{children}</span>
            {state === 'correct' && (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
            )}
            {state === 'incorrect' && (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
            )}
        </button>
    );
}
