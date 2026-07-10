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
import type { User } from '@srms/api-contracts';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';
import { useUser } from '@/modules/user/hooks/use-user';
import { useCreateUser } from '@/modules/user/hooks/use-create-user';
import { useUpdateUser } from '@/modules/user/hooks/use-update-user';
import { useDeleteUser } from '@/modules/user/hooks/use-delete-user';
import { UserForm, UserToFormValues } from '@/modules/user/components/user-form';
import { DeleteUserDialog } from '@/modules/user/components/delete-user-dialog';
import type { CreateUserDTO } from '@srms/api-contracts/user';

const DEFAULT_LIMIT = 10;

export default function UserPage() {
  const users = useAuthSessionStore((s) => s.user);
  const isAdmin = users?.role === USER_ROLE.ADMIN;

  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const userQuery = useUser(page, DEFAULT_LIMIT);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const pagination = userQuery.data?.data.pagination;
  const user = userQuery.data?.data.data ?? [];

  const handleCreate = (values: CreateUserDTO) => {
    createMutation.mutate(values, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleEdit = (values: CreateUserDTO) => {
    if (!editUser) return;
    updateMutation.mutate(
      { id: editUser.id, payload: values },
      { onSuccess: () => setEditUser(null) },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteUser) return;
    deleteMutation.mutate(deleteUser.id, {
      onSuccess: () => setDeleteUser(null),
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
          <h1 className="text-xl font-semibold">user</h1>
          <p className="text-sm text-muted-foreground">Manage menu user for your restaurant</p>
        </div>
        {isAdmin && <Button onClick={() => setCreateOpen(true)}>New User</Button>}
      </div>

      {/* Table */}
      {userQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : userQuery.isError ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">Failed to load user.</p>
          <Button variant="outline" onClick={() => userQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : user.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">No user yet.</p>
          {isAdmin && <Button onClick={() => setCreateOpen(true)}>Create your first user</Button>}
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
              {user.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email ?? '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditUser(user)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteUser(user)}>
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
            <SheetTitle>New User</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <UserForm
              onSubmit={handleCreate}
              isPending={createMutation.isPending}
              submitLabel="Create"
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {editUser && (
              <UserForm
                key={editUser.id}
                defaultValues={UserToFormValues(editUser)}
                onSubmit={handleEdit}
                isPending={updateMutation.isPending}
                submitLabel="Save Changes"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Sheet */}
      <Sheet open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Delete User</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {deleteUser && (
              <DeleteUserDialog
                user={deleteUser}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteUser(null)}
                isPending={deleteMutation.isPending}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
