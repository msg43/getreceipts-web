'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileErrorFallback } from './MobileErrorFallback';
import { isMobileDevice } from '@/lib/mobile-utils';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isMobile: boolean;
}

export default class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, isMobile: false };
  }

  componentDidMount() {
    this.setState({ isMobile: isMobileDevice() });
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use mobile-specific error fallback for mobile devices
      if (this.state.isMobile) {
        return (
          <MobileErrorFallback 
            error={this.state.error} 
            resetErrorBoundary={() => this.setState({ hasError: false, error: null })}
          />
        );
      }

      // Desktop error fallback
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-red-600">Something went wrong</CardTitle>
              <CardDescription>
                We&apos;re sorry, but something unexpected happened. This error has been logged.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {this.state.error?.message || 'An unknown error occurred'}
              </p>
              <div className="flex gap-2">
                <Button onClick={() => window.location.reload()}>
                  Reload Page
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
