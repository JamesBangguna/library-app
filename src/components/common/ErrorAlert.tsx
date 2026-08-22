// src/components/common/ErrorAlert.tsx
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorAlertProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorAlert({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}: ErrorAlertProps) {
  return (
    <div className='my-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive'>
      <div className='flex items-start gap-3'>
        <AlertCircle className='mt-0.5 h-5 w-5 shrink-0' />
        <div className='flex-1'>
          <h5 className='font-medium leading-none tracking-tight mb-1'>
            {title}
          </h5>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm'>
            <span>{message}</span>
            {onRetry && (
              <Button
                variant='outline'
                size='sm'
                onClick={onRetry}
                className='border-destructive/30 hover:bg-destructive/20'
              >
                <RefreshCw className='mr-2 h-3.5 w-3.5' />
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
