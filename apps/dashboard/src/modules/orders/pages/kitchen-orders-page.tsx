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

import { useOrders, useUpdateOrderStatus } from '@/modules/orders/hooks';

const DEFAULT_LIMIT = 20;

const nextStatusByCurrent: Record<OrderStatus, OrderStatus | null> = {
  [ORDER_STATUS.PENDING]: ORDER_STATUS.PREPARING,
  [ORDER_STATUS.PREPARING]: ORDER_STATUS.READY,
  [ORDER_STATUS.READY]: ORDER_STATUS.COMPLETED,
  [ORDER_STATUS.COMPLETED]: null,
};

export default function KitchenOrdersPage() {
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      page,
      limit: DEFAULT_LIMIT,
    }),
    [page],
  );

  const ordersQuery = useOrders(params);
  const updateStatusMutation = useUpdateOrderStatus();

  const orders = ordersQuery.data?.data.data ?? [];
  const pagination = ordersQuery.data?.data.pagination;

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-semibold">Kitchen Orders</h1>
        <p className="text-sm text-muted-foreground">
          Advance order statuses through the kitchen lifecycle.
        </p>
      </div>

      {ordersQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading kitchen orders...</p>
      ) : ordersQuery.isError ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm text-muted-foreground">Failed to load orders.</p>
          <Button variant="outline" onClick={() => ordersQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders found.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const nextStatus = nextStatusByCurrent[order.status as OrderStatus];

                return (
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
                    <TableCell className="text-right">
                      {nextStatus ? (
                        <Button
                          size="sm"
                          disabled={updateStatusMutation.isPending}
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: order.id,
                              payload: { status: nextStatus },
                            })
                          }
                        >
                          Move to {nextStatus}
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">Final</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
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
