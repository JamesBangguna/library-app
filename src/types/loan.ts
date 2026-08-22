export type LoanStatus = 'BORROWED' | 'RETURNED' | 'OVERDUE';

export interface Loan {
  id: number;
  bookId: number;
  userId: number;
  borrowDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: LoanStatus;
  book?: {
    id: number;
    title: string;
    coverImage?: string | null;
    author?: { name: string };
  };
}
