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
import type { KitchenSection } from '@srms/api-contracts';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';
import { useKitchenSections } from '@/modules/kitchen-section/hooks/use-kitchen-section';
import { useCreateKitchenSection } from '@/modules/kitchen-section/hooks/use-create-kitchen-section';
import { useUpdateKitchenSection } from '@/modules/kitchen-section/hooks/use-update-kitchen-section';
import { useDeleteKitchenSection } from '@/modules/kitchen-section/hooks/use-delete-kitchen-section';
import {
  KitchenSectionForm,
  kitchenSectionToFormValues,
} from '@/modules/kitchen-section/components/kitchen-section-form';
import { DeleteKitchenSectionDialog } from '@/modules/kitchen-section/components/delete-kitchen-section-dialog';
import type { CreateKitchenSectionDTO } from '@srms/api-contracts/kitchen-section';

const DEFAULT_LIMIT = 10;

export default function KitchenSectionsPage() {
  const user = useAuthSessionStore((s) => s.user);
  const isAdmin = user?.role === USER_ROLE.ADMIN;

  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editSection, setEditSection] = useState<KitchenSection | null>(null);
  const [deleteSection, setDeleteSection] = useState<KitchenSection | null>(null);

  const sectionsQuery = useKitchenSections(page, DEFAULT_LIMIT);
  const createMutation = useCreateKitchenSection();
  const updateMutation = useUpdateKitchenSection();
  const deleteMutation = useDeleteKitchenSection();

  const pagination = sectionsQuery.data?.data.pagination;
  const sections = sectionsQuery.data?.data.data ?? [];

  const handleCreate = (values: CreateKitchenSectionDTO) => {
    createMutation.mutate(values, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleEdit = (values: CreateKitchenSectionDTO) => {
    if (!editSection) return;
    updateMutation.mutate(
      { id: editSection.id, payload: values },
      { onSuccess: () => setEditSection(null) },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteSection) return;
    deleteMutation.mutate(deleteSection.id, {
      onSuccess: () => setDeleteSection(null),
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
          <h1 className="text-xl font-semibold">Kitchen Sections</h1>
          <p className="text-sm text-muted-foreground">
            Manage kitchen sections for your restaurant
          </p>
        </div>
        {isAdmin && <Button onClick={() => setCreateOpen(true)}>New Section</Button>}
      </div>

      {/* Table */}
      {sectionsQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : sectionsQuery.isError ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">Failed to load kitchen sections.</p>
          <Button variant="outline" onClick={() => sectionsQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : sections.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">No kitchen sections yet.</p>
          {isAdmin && (
            <Button onClick={() => setCreateOpen(true)}>Create your first section</Button>
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
              {sections.map((sec) => (
                <TableRow key={sec.id}>
                  <TableCell className="font-medium">{sec.name}</TableCell>
                  <TableCell className="text-muted-foreground">{sec.description ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(sec.createdAt)}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditSection(sec)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteSection(sec)}
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
            <SheetTitle>New Kitchen Section</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <KitchenSectionForm
              onSubmit={handleCreate}
              isPending={createMutation.isPending}
              submitLabel="Create"
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={!!editSection} onOpenChange={(open) => !open && setEditSection(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Kitchen Section</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {editSection && (
              <KitchenSectionForm
                key={editSection.id}
                defaultValues={kitchenSectionToFormValues(editSection)}
                onSubmit={handleEdit}
                isPending={updateMutation.isPending}
                submitLabel="Save Changes"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Sheet */}
      <Sheet open={!!deleteSection} onOpenChange={(open) => !open && setDeleteSection(null)}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Delete Kitchen Section</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {deleteSection && (
              <DeleteKitchenSectionDialog
                kitchenSection={deleteSection}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteSection(null)}
                isPending={deleteMutation.isPending}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
