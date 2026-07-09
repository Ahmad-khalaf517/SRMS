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
import type { Category } from '@srms/api-contracts';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';
import { useCategories } from '@/modules/categories/hooks/use-categories';
import { useCreateCategory } from '@/modules/categories/hooks/use-create-category';
import { useUpdateCategory } from '@/modules/categories/hooks/use-update-category';
import { useDeleteCategory } from '@/modules/categories/hooks/use-delete-category';
import { CategoryForm, categoryToFormValues } from '@/modules/categories/components/category-form';
import { DeleteCategoryDialog } from '@/modules/categories/components/delete-category-dialog';
import type { CreateCategoryDTO } from '@srms/api-contracts/categories';

const DEFAULT_LIMIT = 10;

export default function CategoriesPage() {
  const user = useAuthSessionStore((s) => s.user);
  const isAdmin = user?.role === USER_ROLE.ADMIN;

  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const categoriesQuery = useCategories(page, DEFAULT_LIMIT);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const pagination = categoriesQuery.data?.data.pagination;
  const categories = categoriesQuery.data?.data.data ?? [];

  const handleCreate = (values: CreateCategoryDTO) => {
    createMutation.mutate(values, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleEdit = (values: CreateCategoryDTO) => {
    if (!editCategory) return;
    updateMutation.mutate(
      { id: editCategory.id, payload: values },
      { onSuccess: () => setEditCategory(null) },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteCategory) return;
    deleteMutation.mutate(deleteCategory.id, {
      onSuccess: () => setDeleteCategory(null),
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
      {categoriesQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : categoriesQuery.isError ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">Failed to load categories.</p>
          <Button variant="outline" onClick={() => categoriesQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">No categories yet.</p>
          {isAdmin && (
            <Button onClick={() => setCreateOpen(true)}>Create your first category</Button>
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
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.description ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(cat.createdAt)}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditCategory(cat)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteCategory(cat)}
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
            <SheetTitle>New Category</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <CategoryForm
              onSubmit={handleCreate}
              isPending={createMutation.isPending}
              submitLabel="Create"
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={!!editCategory} onOpenChange={(open) => !open && setEditCategory(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {editCategory && (
              <CategoryForm
                key={editCategory.id}
                defaultValues={categoryToFormValues(editCategory)}
                onSubmit={handleEdit}
                isPending={updateMutation.isPending}
                submitLabel="Save Changes"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Sheet */}
      <Sheet open={!!deleteCategory} onOpenChange={(open) => !open && setDeleteCategory(null)}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Delete Category</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {deleteCategory && (
              <DeleteCategoryDialog
                category={deleteCategory}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteCategory(null)}
                isPending={deleteMutation.isPending}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
