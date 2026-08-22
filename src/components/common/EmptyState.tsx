// src/components/common/EmptyState.tsx
import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = 'No data found',
  description = 'There is nothing to show here yet.',
  icon,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
      <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted'>
        {icon || <Inbox className='h-7 w-7 text-muted-foreground' />}
      </div>
      <h3 className='text-lg font-semibold'>{title}</h3>
      <p className='mt-1 max-w-sm text-sm text-muted-foreground'>
        {description}
      </p>

      {actionLabel && (actionHref || onAction) ? (
        <div className='mt-6'>
          {actionHref ? (
            <Button onClick={() => navigate(actionHref)}>{actionLabel}</Button>
          ) : (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
