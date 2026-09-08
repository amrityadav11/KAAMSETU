import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-8xl font-black text-primary-100 mb-4">404</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-500 mb-8 max-w-sm">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/">
                <Button size="lg">Back to Home</Button>
            </Link>
        </div>
    );
}
