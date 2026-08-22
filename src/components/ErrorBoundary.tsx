// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950'>
            <AlertTriangle className='h-8 w-8 text-red-600' />
          </div>
          <div>
            <h1 className='text-2xl font-bold'>Something went wrong</h1>
            <p className='mt-2 max-w-md text-muted-foreground'>
              {this.state.error?.message ||
                'An unexpected error occurred. Please try refreshing the page.'}
            </p>
          </div>
          <div className='flex gap-3'>
            <Button variant='outline' onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button onClick={this.handleReset}>Go to Home</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
