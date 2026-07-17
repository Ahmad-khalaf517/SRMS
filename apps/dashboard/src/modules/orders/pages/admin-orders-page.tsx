import { useMemo, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { ORDER_STATUS, type OrderStatus } from '@srms/api-contracts/orders';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@srms/ui/components/dropdown-menu';
import { useOrders } from '@/modules/orders/hooks';
import { OrdersTable } from '@/modules/orders/components/order-table';

const DEFAULT_LIMIT = 10;

const toDateRange = (fromDate?: string, toDate?: string) => ({
  from: fromDate ? new Date(`${fromDate}T00:00:00.000`).toISOString() : undefined,
  to: toDate ? new Date(`${toDate}T23:59:59.999`).toISOString() : undefined,
});

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const dateRange = useMemo(
    () => toDateRange(fromDate || undefined, toDate || undefined),
    [fromDate, toDate],
  );

  const orderFilters = useMemo(
    () => ({
      page,
      limit: DEFAULT_LIMIT,
      ...(status === 'all' ? {} : { status: status as OrderStatus }),
      ...dateRange,
    }),
    [dateRange, page, status],
  );

  const ordersQuery = useOrders(orderFilters);
  const orders = ordersQuery.data?.data.data ?? [];
  const pagination = ordersQuery.data?.data.pagination;

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-semibold">Orders Management</h1>
        <p className="text-sm text-muted-foreground">
          Monitor all orders with status and date-range analytics.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4 border p-3 rounded-lg">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
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

        <div className="flex flex-col gap-1.5">
          <label htmlFor="from-date" className="text-sm font-medium">
            From
          </label>
          <Input
            type="date"
            value={fromDate}
            onChange={(event) => {
              setFromDate(event.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="to-date" className="text-sm font-medium">
            To
          </label>
          <Input
            type="date"
            value={toDate}
            onChange={(event) => {
              setToDate(event.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <OrdersTable
        title="Orders"
        description="All orders placed across the restaurant."
        orders={orders}
        isLoading={ordersQuery.isLoading}
        error={ordersQuery.error}
        errorMessage="Failed to load orders."
      />
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
    </div>
  );
}
