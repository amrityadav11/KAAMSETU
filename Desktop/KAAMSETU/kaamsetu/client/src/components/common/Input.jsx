import React from 'react';

export default function Input({
    label,
    error,
    hint,
    icon: Icon,
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={16} />
                    </div>
                )}
                <input
                    className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
    );
}
