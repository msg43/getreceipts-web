'use client';

import { useEffect, useState } from 'react';
import { isMobileDevice } from '@/lib/mobile-utils';

interface MobileErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function MobileErrorFallback({ error, resetErrorBoundary }: MobileErrorFallbackProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          {isMobile ? (
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          ) : (
            <svg className="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isMobile ? 'Mobile Loading Error' : 'Something went wrong'}
        </h1>
        
        <div className="text-gray-600 mb-6 space-y-2">
          <p>
            {isMobile 
              ? 'The mobile version encountered an error. This might be due to:'
              : 'An unexpected error occurred:'
            }
          </p>
          <ul className="text-sm text-left list-disc list-inside space-y-1">
            {isMobile ? (
              <>
                <li>Slow mobile connection</li>
                <li>Limited device memory</li>
                <li>Outdated mobile browser</li>
                <li>JavaScript compatibility issues</li>
              </>
            ) : (
              <>
                <li>Network connectivity issues</li>
                <li>Browser compatibility problems</li>
                <li>Temporary server issues</li>
              </>
            )}
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Refresh Page
          </button>

          {isMobile && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Mobile Tip:</strong> Try switching to a desktop browser or check your internet connection
              </p>
            </div>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-32">
              {error.stack || error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
