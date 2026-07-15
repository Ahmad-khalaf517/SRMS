import { useState } from 'react';
import { USER_ROLE } from '@srms/api-contracts';
import { Button } from '@srms/ui/components/button';
import { Skeleton } from '@srms/ui/components/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@srms/ui/components/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@srms/ui/components/sheet';
import type { Expenses, CreateExpensesDTO, UpdateExpensesDTO } from '@srms/api-contracts';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';
import { useExpenses } from '@/modules/expenses/hooks/use-expenses';
import { useCreateExpenses } from '@/modules/expenses/hooks/use-create-expenses';
import { useUpdateExpenses } from '@/modules/expenses/hooks/use-update-expenses';
import { useDeleteExpenses } from '@/modules/expenses/hooks/use-delete-expenses';
import { ExpensesForm, expensesToFormValues } from '@/modules/expenses/components/expenses-form';
import { DeleteExpensesDialog } from '@/modules/expenses/components/delete-expenses';

const DEFAULT_LIMIT = 10;

export default function ExpensesPage() {
  const user = useAuthSessionStore((s) => s.user);
  const isAdmin = user?.role === USER_ROLE.ADMIN;

  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expenses | null>(null);
  const [deleteExpense, setDeleteExpense] = useState<Expenses | null>(null);

  const expensesQuery = useExpenses(page, DEFAULT_LIMIT);
  const createMutation = useCreateExpenses();
  const updateMutation = useUpdateExpenses();
  const deleteMutation = useDeleteExpenses();

  const pagination = expensesQuery.data?.data.pagination;
  const expenses = expensesQuery.data?.data.data ?? [];

  const handleCreate = (values: CreateExpensesDTO) => {
    if (!user) return;

    createMutation.mutate(values, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleEdit = (values: UpdateExpensesDTO) => {
    if (!editExpense) return;
    updateMutation.mutate(
      { id: editExpense.id, payload: values },
      { onSuccess: () => setEditExpense(null) },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteExpense) return;
    deleteMutation.mutate(deleteExpense.id, {
      onSuccess: () => setDeleteExpense(null),
    });
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Expenses</h1>
          <p className="text-sm text-muted-foreground">Manage expenses for your restaurant</p>
        </div>
        {isAdmin && <Button onClick={() => setCreateOpen(true)}>New Expense</Button>}
      </div>

      {expensesQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : expensesQuery.isError ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">Failed to load expenses.</p>
          <Button variant="outline" onClick={() => expensesQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : expenses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">No expenses yet.</p>
          {isAdmin && (
            <Button onClick={() => setCreateOpen(true)}>Create your first expense</Button>
          )}
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense No</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="font-medium">{exp.expenseNo}</TableCell>
                  <TableCell>{exp.title}</TableCell>
                  <TableCell className="text-muted-foreground">{exp.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(exp.date)}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditExpense(exp)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteExpense(exp)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Expense</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <ExpensesForm
              onSubmit={handleCreate}
              isPending={createMutation.isPending}
              submitLabel="Create"
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editExpense} onOpenChange={(open) => !open && setEditExpense(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Expense</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {editExpense && (
              <ExpensesForm
                key={editExpense.id}
                defaultValues={expensesToFormValues(editExpense)}
                onSubmit={handleEdit}
                isPending={updateMutation.isPending}
                submitLabel="Save Changes"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={!!deleteExpense} onOpenChange={(open) => !open && setDeleteExpense(null)}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Delete Expense</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {deleteExpense && (
              <DeleteExpensesDialog
                expense={deleteExpense}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteExpense(null)}
                isPending={deleteMutation.isPending}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
