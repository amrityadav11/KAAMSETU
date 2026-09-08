import React from 'react';
import Button from './Button';

/**
 * Catches unexpected render errors and shows a friendly fallback.
 * Wrap page-level components or the whole App with this.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production you'd send this to a logging service
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-8 max-w-sm">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            <Button variant="secondary" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-8 text-xs text-left bg-gray-100 p-4 rounded-xl max-w-2xl overflow-auto text-red-700">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
