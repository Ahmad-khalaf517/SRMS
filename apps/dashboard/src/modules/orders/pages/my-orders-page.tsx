import { useMemo, useState } from 'react';

import { ORDER_STATUS, type OrderStatus } from '@srms/api-contracts/orders';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@srms/ui/components/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@srms/ui/components/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

import { useMyOrders } from '@/modules/orders/hooks';

const DEFAULT_LIMIT = 10;

export default function MyOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');

  const params = useMemo(
    () => ({
      page,
      limit: DEFAULT_LIMIT,
      search: search.trim() || undefined,
      status: status === 'all' ? undefined : (status as OrderStatus),
    }),
    [page, search, status],
  );

  const myOrdersQuery = useMyOrders(params);

  const orders = myOrdersQuery.data?.data.data ?? [];
  const pagination = myOrdersQuery.data?.data.pagination;

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-semibold">My Orders</h1>
        <p className="text-sm text-muted-foreground">Track orders created by your account.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          placeholder="Search by order number"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span>{status === 'all' ? 'All statuses' : status}</span>
                <ChevronDownIcon className="size-4 text-muted-foreground" />
              </button>
            }
          />
          <DropdownMenuContent className="w-(--anchor-width)">
            <DropdownMenuRadioGroup
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={ORDER_STATUS.PENDING}>Pending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={ORDER_STATUS.PREPARING}>
                Preparing
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={ORDER_STATUS.READY}>Ready</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={ORDER_STATUS.COMPLETED}>
                Completed
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {myOrdersQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading orders...</p>
      ) : myOrdersQuery.isError ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm text-muted-foreground">Failed to load your orders.</p>
          <Button variant="outline" onClick={() => myOrdersQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders found for the selected filters.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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
    </div>
  );
}
