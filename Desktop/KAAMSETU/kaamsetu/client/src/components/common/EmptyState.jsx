import React from 'react';
import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {Icon && (
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                    <Icon size={28} className="text-primary-400" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            {description && <p className="text-gray-500 text-sm max-w-xs mb-6">{description}</p>}
            {action && (
                <Button onClick={action} variant="primary">
                    {actionLabel || 'Get Started'}
                </Button>
            )}
        </div>
    );
}
