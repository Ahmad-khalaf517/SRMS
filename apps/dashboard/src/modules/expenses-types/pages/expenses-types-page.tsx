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
import type { ExpensesTypes } from '@srms/api-contracts';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';
import { useExpensesTypes } from '@/modules/expenses-types/hooks/use-expenses-types';
import { useCreateExpensesTypes } from '@/modules/expenses-types/hooks/use-create-expenses-types';
import { useUpdateExpensesTypes } from '@/modules/expenses-types/hooks/use-update-expenses-types';
import { useDeleteExpensesTypes } from '@/modules/expenses-types/hooks/use-delete-expenses-types';
import {
  ExpensesTypesForm,
  expensesTypesToFormValues,
} from '@/modules/expenses-types/components/expenses-types-form';
import { DeleteExpensesTypesDialog } from '@/modules/expenses-types/components/delete-expenses-types-dialog';
import type { CreateExpensesTypesDTO } from '@srms/api-contracts/expenses-types';

const DEFAULT_LIMIT = 10;

export default function ExpensesTypesPage() {
  const user = useAuthSessionStore((s) => s.user);
  const isAdmin = user?.role === USER_ROLE.ADMIN;

  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editExpensesType, setEditExpensesType] = useState<ExpensesTypes | null>(null);
  const [deleteExpensesType, setDeleteExpensesType] = useState<ExpensesTypes | null>(null);

  const expensesTypesQuery = useExpensesTypes(page, DEFAULT_LIMIT);
  const createMutation = useCreateExpensesTypes();
  const updateMutation = useUpdateExpensesTypes();
  const deleteMutation = useDeleteExpensesTypes();

  const pagination = expensesTypesQuery.data?.data.pagination;
  const expensesTypes = expensesTypesQuery.data?.data.data ?? [];

  const handleCreate = (values: CreateExpensesTypesDTO) => {
    createMutation.mutate(values, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleEdit = (values: CreateExpensesTypesDTO) => {
    if (!editExpensesType) return;
    updateMutation.mutate(
      { id: editExpensesType.id, payload: values },
      { onSuccess: () => setEditExpensesType(null) },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteExpensesType) return;
    deleteMutation.mutate(deleteExpensesType.id, {
      onSuccess: () => setDeleteExpensesType(null),
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage menu categories for your restaurant
          </p>
        </div>
        {isAdmin && <Button onClick={() => setCreateOpen(true)}>New Category</Button>}
      </div>

      {/* Table */}
      {expensesTypesQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : expensesTypesQuery.isError ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">Failed to load expenses types.</p>
          <Button variant="outline" onClick={() => expensesTypesQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : expensesTypes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">No expenses types yet.</p>
          {isAdmin && (
            <Button onClick={() => setCreateOpen(true)}>Create your first expenses type</Button>
          )}
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {expensesTypes.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.description ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditExpensesType(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteExpensesType(item)}
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

          {/* Pagination */}
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

      {/* Create Sheet */}
      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Expenses Type</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <ExpensesTypesForm
              onSubmit={handleCreate}
              isPending={createMutation.isPending}
              submitLabel="Create"
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={!!editExpensesType} onOpenChange={(open) => !open && setEditExpensesType(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Expenses Type</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {editExpensesType && (
              <ExpensesTypesForm
                key={editExpensesType.id}
                defaultValues={expensesTypesToFormValues(editExpensesType)}
                onSubmit={handleEdit}
                isPending={updateMutation.isPending}
                submitLabel="Save Changes"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Sheet */}
      <Sheet
        open={!!deleteExpensesType}
        onOpenChange={(open) => !open && setDeleteExpensesType(null)}
      >
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Delete Expenses Type</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {deleteExpensesType && (
              <DeleteExpensesTypesDialog
                expensesType={deleteExpensesType}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteExpensesType(null)}
                isPending={deleteMutation.isPending}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
