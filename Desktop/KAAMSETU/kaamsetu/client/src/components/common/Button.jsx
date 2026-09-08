import React from 'react';
import Loader from './Loader';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    className = '',
    ...props
}) {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md',
        secondary: 'bg-white border border-primary-600 text-primary-600 hover:bg-primary-50',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        ghost: 'text-gray-600 hover:text-primary-600 hover:bg-gray-100',
        outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? <Loader size="sm" /> : Icon && <Icon size={16} />}
            {children}
        </button>
    );
}
