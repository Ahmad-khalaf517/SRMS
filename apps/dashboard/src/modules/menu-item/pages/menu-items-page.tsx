import { useMemo, useState } from 'react';
import { USER_ROLE } from '@srms/api-contracts';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';
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
import type {
  Category,
  KitchenSection,
  MenuItemListItem,
  MenuItem,
  CreateMenuItemDTO,
} from '@srms/api-contracts';
import { useAuthSessionStore } from '@/modules/auth/store/auth-session.store';
import { useCategories } from '@/modules/categories/hooks/use-categories';
import { useKitchenSections } from '@/modules/kitchen-section/hooks/use-kitchen-section';
import { useMenuItems } from '@/modules/menu-item/hooks/use-menu-items';
import { useMenuItem } from '@/modules/menu-item/hooks/use-menu-item';
import { useCreateMenuItem } from '@/modules/menu-item/hooks/use-create-menu-item';
import { useUpdateMenuItem } from '@/modules/menu-item/hooks/use-update-menu-item';
import { useDeleteMenuItem } from '@/modules/menu-item/hooks/use-delete-menu-item';
import { useToggleMenuItemAvailability } from '@/modules/menu-item/hooks/use-toggle-menu-item-availability';
import { DeleteMenuItemDialog } from '@/modules/menu-item/components/delete-menu-item-dialog';
import { MenuItemForm } from '@/modules/menu-item/components/menu-item-form';
import { menuItemToFormValues } from '@/modules/menu-item/components/menu-item-form-values';
import { Switch } from '@srms/ui/components/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@srms/ui/components/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

const DEFAULT_LIMIT = 10;
const OPTION_LIMIT = 100;

export default function MenuItemsPage() {
  const user = useAuthSessionStore((state) => state.user);
  const isAdmin = user?.role === USER_ROLE.ADMIN;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [kitchenSectionId, setKitchenSectionId] = useState<string>('all');
  const [availability, setAvailability] = useState<string>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItemListItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      page,
      limit: DEFAULT_LIMIT,
      search: search.trim() || undefined,
      categoryId: categoryId === 'all' ? undefined : categoryId,
      kitchenSectionId: kitchenSectionId === 'all' ? undefined : kitchenSectionId,
      isAvailable: availability === 'all' ? undefined : availability === 'true',
    }),
    [availability, categoryId, kitchenSectionId, page, search],
  );

  const menuItemsQuery = useMenuItems(filters);
  const categoriesQuery = useCategories(1, OPTION_LIMIT);
  const kitchenSectionsQuery = useKitchenSections(1, OPTION_LIMIT);
  const detailQuery = useMenuItem(detailId);
  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();
  const toggleMutation = useToggleMenuItemAvailability();
  const deleteMutation = useDeleteMenuItem();

  const categories: Category[] = categoriesQuery.data?.data.data ?? [];
  const kitchenSections: KitchenSection[] = kitchenSectionsQuery.data?.data.data ?? [];
  const menuItems = menuItemsQuery.data?.data.data ?? [];
  const pagination = menuItemsQuery.data?.data.pagination;

  const handleCreate = (values: CreateMenuItemDTO) => {
    createMutation.mutate(values, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleEdit = (values: CreateMenuItemDTO) => {
    if (!editItem) return;
    updateMutation.mutate(
      { id: editItem.id, payload: values },
      {
        onSuccess: () => setEditItem(null),
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(deleteItem.id, {
      onSuccess: () => setDeleteItem(null),
    });
  };

  const handleToggleAvailability = (item: MenuItemListItem) => {
    toggleMutation.mutate({
      id: item.id,
      payload: { isAvailable: !item.isAvailable },
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Menu Items</h1>
          <p className="text-sm text-muted-foreground">
            Manage restaurant offerings, pricing, and availability.
          </p>
        </div>
        {isAdmin ? <Button onClick={() => setCreateOpen(true)}>New Menu Item</Button> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  id="categoryId"
                  type="button"

                  className="flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
                >
                  <span className={categoryId ? '' : 'text-muted-foreground'}>
                    {categories.find((category) => category.id === categoryId)?.name ??
                      'Select category'}
                  </span>
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--anchor-width)">
              <DropdownMenuRadioGroup
                value={categoryId}
                onValueChange={(value) => {
                  setCategoryId(value ?? '');
                  setPage(1);
                }}
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                {categories.map((category) => (
                  <DropdownMenuRadioItem key={category.id} value={category.id}>
                    {category.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  id="kitchenSectionId"
                  type="button"

                  className="flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
                >
                  <span className={kitchenSectionId ? '' : 'text-muted-foreground'}>
                    {kitchenSections.find((section) => section.id === kitchenSectionId)?.name ??
                      'Select kitchen section'}
                  </span>
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--anchor-width)">
              <DropdownMenuRadioGroup
                value={kitchenSectionId}
                onValueChange={(value) => {
                  setKitchenSectionId(value ?? '');
                  setPage(1);
                }}
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                {kitchenSections.map((section) => (
                  <DropdownMenuRadioItem key={section.id} value={section.id}>
                    {section.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  id="availability"
                  type="button"
                  className="flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
                >
                  <span className={availability ? '' : 'text-muted-foreground'}>
                    {availability === 'all'
                      ? 'All availability'
                      : availability === 'true'
                        ? 'Available'
                        : 'Unavailable'}
                  </span>
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--anchor-width)">
              <DropdownMenuRadioGroup
                value={availability}
                onValueChange={(value) => {
                  setAvailability(value ?? 'all');
                  setPage(1);
                }}
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="true">Available</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="false">Unavailable</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {menuItemsQuery.isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : menuItemsQuery.isError ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">Failed to load menu items.</p>
          <Button variant="outline" onClick={() => menuItemsQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">No menu items found.</p>
          {isAdmin ? (
            <Button onClick={() => setCreateOpen(true)}>Create your first menu item</Button>
          ) : null}
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Kitchen Section</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <button
                      className="font-medium hover:underline"
                      onClick={() => setDetailId(item.id)}
                    >
                      {item.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.categoryName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.kitchenSectionName}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={() => handleToggleAvailability(item)}
                      disabled={!isAdmin || toggleMutation.isPending}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setDetailId(item.id)}>
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!isAdmin}
                        onClick={() => setEditItem(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={!isAdmin}
                        onClick={() =>
                          detailQuery.data?.data
                            ? setDeleteItem(detailQuery.data.data)
                            : setDetailId(item.id)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && pagination.totalPages > 1 ? (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => value - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((value) => value + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Menu Item</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <MenuItemForm
              categories={categories}
              kitchenSections={kitchenSections}
              onSubmit={handleCreate}
              isPending={createMutation.isPending}
              submitLabel="Create"
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Menu Item</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {editItem ? (
              <MenuItemForm
                key={editItem.id}
                categories={categories}
                kitchenSections={kitchenSections}
                defaultValues={menuItemToFormValues({
                  ...editItem,
                  description: detailQuery.data?.data.description,
                  restaurantId: detailQuery.data?.data.restaurantId ?? user?.restaurantId ?? '',
                  updatedAt:
                    detailQuery.data?.data.updatedAt ??
                    detailQuery.data?.data.createdAt ??
                    new Date().toISOString(),
                } as MenuItem)}
                onSubmit={handleEdit}
                isPending={updateMutation.isPending}
                submitLabel="Save Changes"
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={!!detailId} onOpenChange={(open) => !open && setDetailId(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu Item Details</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {detailQuery.isLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full rounded-lg" />
                ))}
              </div>
            ) : detailQuery.data?.data ? (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {detailQuery.data.data.name}
                </div>
                <div>
                  <span className="font-medium">Description:</span>{' '}
                  {detailQuery.data.data.description ?? '—'}
                </div>
                <div>
                  <span className="font-medium">Price:</span> $
                  {detailQuery.data.data.price.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Category:</span>{' '}
                  {categories.find((c) => c.id === detailQuery.data?.data.categoryId)?.name ??
                    detailQuery.data.data.categoryId}
                </div>
                <div>
                  <span className="font-medium">Kitchen Section:</span>{' '}
                  {kitchenSections.find((s) => s.id === detailQuery.data?.data.kitchenSectionId)
                    ?.name ?? detailQuery.data.data.kitchenSectionId}
                </div>
                <div>
                  <span className="font-medium">Available:</span>{' '}
                  {detailQuery.data.data.isAvailable ? 'Yes' : 'No'}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Unable to load menu item details.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Delete Menu Item</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            {deleteItem ? (
              <DeleteMenuItemDialog
                menuItem={deleteItem}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteItem(null)}
                isPending={deleteMutation.isPending}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
