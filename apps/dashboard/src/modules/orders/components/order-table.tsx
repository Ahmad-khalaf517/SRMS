import { ORDER_STATUS, type OrderStatus } from '@srms/api-contracts/orders';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@srms/ui/components/card';
import { Skeleton } from '@srms/ui/components/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@srms/ui/components/table';
import { ClipboardList } from 'lucide-react';

import { useOrders } from '@/modules/orders/hooks';

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

export function OrdersTable() {
  const ordersQuery = useOrders({ page: 1, limit: 8 });
  const orders = ordersQuery.data?.data.data ?? [];
  const isLoading = ordersQuery.isLoading;

  return (
    <Card className="@container/card relative overflow-hidden border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
            <ClipboardList className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-zinc-50">
              Recent Orders
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-zinc-400">
              The latest orders placed across the restaurant.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : ordersQuery.isError ? (
          <p className="text-sm text-muted-foreground">Failed to load recent orders.</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created By</TableHead>
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
                  <TableCell className="text-slate-500 dark:text-zinc-400">
                    {order.createdByName ?? order.createdBy}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
