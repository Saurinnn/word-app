import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl border-b-4 border-primary-hover bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all ease-in-out hover:bg-primary-hover hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:border-b-[0px] active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-b-4 disabled:translate-y-0 disabled:bg-neutral ${disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
