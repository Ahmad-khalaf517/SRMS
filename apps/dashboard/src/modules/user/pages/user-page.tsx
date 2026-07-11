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
import { UserForm } from '@/modules/user/components/user-form';
import { DeleteUserDialog } from '@/modules/user/components/delete-user-dialog';
import type { CreateUserDTO, UserRole } from '@srms/api-contracts/user';

const DEFAULT_LIMIT = 10;

export default function UserPage() {
  const currentUser = useAuthSessionStore((s) => s.user);
  const isAdmin = currentUser?.role === USER_ROLE.ADMIN;

  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const userQuery = useUser(page, DEFAULT_LIMIT);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const pagination = userQuery.data?.data.pagination;
  const users = userQuery.data?.data.data ?? [];

  const handleCreate = (values: CreateUserDTO) => {
    createMutation.mutate(values, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteUser) return;
    deleteMutation.mutate(deleteUser.id, {
      onSuccess: () => setDeleteUser(null),
    });
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateMutation.mutate({ id: userId, payload: { role } });
  };

  const handleToggleActive = (userRecord: User) => {
    updateMutation.mutate({ id: userRecord.id, payload: { isActive: !userRecord.isActive } });
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
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage users for your restaurant</p>
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
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">No users yet.</p>
          {isAdmin && <Button onClick={() => setCreateOpen(true)}>Create your first user</Button>}
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <select
                      value={user.role}
                      disabled={!isAdmin || updateMutation.isPending}
                      onChange={(event) =>
                        handleRoleChange(user.id, event.target.value as UserRole)
                      }
                      className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                    >
                      <option value={USER_ROLE.ADMIN}>Admin</option>
                      <option value={USER_ROLE.CASHIER}>Cashier</option>
                      <option value={USER_ROLE.KITCHEN_STAFF}>Kitchen Staff</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        user.isActive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-muted-foreground'
                      }
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(user)}
                          disabled={updateMutation.isPending}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteUser(user)}
                          disabled={deleteMutation.isPending}
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
            <SheetTitle>New User</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <UserForm onSubmit={handleCreate} isPending={createMutation.isPending} />
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
