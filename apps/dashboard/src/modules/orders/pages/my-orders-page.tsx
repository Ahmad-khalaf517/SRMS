import { useMemo, useState } from 'react';

import { ORDER_STATUS, type OrderStatus } from '@srms/api-contracts/orders';
import { Button } from '@srms/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@srms/ui/components/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@srms/ui/components/card';
import { ClipboardList } from 'lucide-react';

import { useMyOrders } from '@/modules/orders/hooks';
import { Skeleton } from '@srms/ui/components/skeleton';

const DEFAULT_LIMIT = 10;

const currency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const STATUS_STYLES: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  [ORDER_STATUS.PREPARING]:
    'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
  [ORDER_STATUS.READY]:
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  [ORDER_STATUS.COMPLETED]: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300',
  [ORDER_STATUS.CANCELLED]: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function MyOrdersPage() {
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      page,
      limit: DEFAULT_LIMIT,
    }),
    [page],
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

      <Card className="@container/card relative overflow-hidden border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-zinc-50">
                My Orders
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-zinc-400">
                Track orders created by your account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {myOrdersQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : myOrdersQuery.isError ? (
            <p className="text-sm text-muted-foreground">{myOrdersQuery.error?.message}</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-slate-500 dark:text-zinc-400">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{currency.format(order.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
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
