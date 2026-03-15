import { ButtonHTMLAttributes } from 'react';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded-xl border-2 border-b-4 border-gray-200 bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-neutral transition-all ease-in-out hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:border-b-2 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
