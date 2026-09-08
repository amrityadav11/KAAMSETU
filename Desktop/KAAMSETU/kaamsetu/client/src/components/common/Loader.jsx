import React from 'react';

export default function Loader({ fullScreen = false, size = 'md', text = '' }) {
    const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

    const spinner = (
        <div className="flex flex-col items-center gap-3">
            <div
                className={`${sizes[size]} border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin`}
            />
            {text && <p className="text-sm text-gray-500">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-3xl font-black text-primary-600">KaamSetu</div>
                    {spinner}
                </div>
            </div>
        );
    }

    return <div className="flex items-center justify-center py-10">{spinner}</div>;
}
