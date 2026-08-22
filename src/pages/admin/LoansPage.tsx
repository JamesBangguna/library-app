// src/pages/admin/LoansPage.tsx
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { loanService } from '@/services/loan.service';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Loan {
  id: number;
  bookId: number;
  userId: number;
  borrowDate: string;
  dueDate: string;
  status: string;
  book?: {
    title: string;
  };
  user?: {
    name: string;
  };
}

export default function LoansPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-loans', statusFilter],
    queryFn: () =>
      loanService.getAll({
        status: statusFilter === 'all' ? undefined : statusFilter,
      }),
  });

  // Safe parsing of loans data supporting array or paginated response format
  const loans: Loan[] = (() => {
    if (Array.isArray(data)) return data;
    if (
      data &&
      typeof data === 'object' &&
      'data' in data &&
      Array.isArray((data as { data: unknown }).data)
    ) {
      return (data as { data: Loan[] }).data;
    }
    return [];
  })();

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      loanService.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Status updated');
      qc.invalidateQueries({ queryKey: ['admin-loans'] });
    },
  });

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold'>Loans</h1>
        <Select
          value={statusFilter}
          onValueChange={(val) => {
            if (val !== null) setStatusFilter(val);
          }}
        >
          <SelectTrigger className='w-40'>
            <SelectValue placeholder='Filter status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='BORROWED'>Borrowed</SelectItem>
            <SelectItem value='RETURNED'>Returned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-20 w-full' />
          ))}
        </div>
      ) : (
        <div className='space-y-3'>
          {loans.map((loan: Loan) => (
            <div
              key={loan.id}
              className='flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between'
            >
              <div>
                <p className='font-semibold'>
                  {loan.book?.title || `Book #${loan.bookId}`}
                </p>
                <p className='text-sm text-muted-foreground'>
                  User: {loan.user?.name || loan.userId}
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Borrowed: {format(new Date(loan.borrowDate), 'dd MMM yyyy')} •
                  Due: {format(new Date(loan.dueDate), 'dd MMM yyyy')}
                </p>
              </div>

              <div className='flex items-center gap-3'>
                <Badge
                  variant={loan.status === 'RETURNED' ? 'secondary' : 'default'}
                >
                  {loan.status}
                </Badge>

                {loan.status === 'BORROWED' && (
                  <Button
                    size='sm'
                    onClick={() =>
                      updateMutation.mutate({
                        id: loan.id,
                        status: 'RETURNED',
                      })
                    }
                    disabled={updateMutation.isPending}
                  >
                    Mark Returned
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
