import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ORDER_STATUS, type OrderStatus } from '@srms/api-contracts/orders';
import { Button } from '@srms/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@srms/ui/components/card';

import { useOrders, useUpdateOrderStatus } from '@/modules/orders/hooks';

const DEFAULT_LIMIT = 20;

const nextStatusByCurrent: Record<OrderStatus, OrderStatus | null> = {
  [ORDER_STATUS.PENDING]: ORDER_STATUS.PREPARING,
  [ORDER_STATUS.PREPARING]: ORDER_STATUS.READY,
  [ORDER_STATUS.READY]: ORDER_STATUS.COMPLETED,
  [ORDER_STATUS.COMPLETED]: null,
};

const statusColumns: Array<{ key: OrderStatus; title: string; description: string }> = [
  {
    key: ORDER_STATUS.PENDING,
    title: 'Pending',
    description: 'New orders waiting for kitchen action',
  },
  {
    key: ORDER_STATUS.PREPARING,
    title: 'Preparing',
    description: 'Orders currently being cooked',
  },
  {
    key: ORDER_STATUS.READY,
    title: 'Ready',
    description: 'Orders ready to hand off',
  },
  {
    key: ORDER_STATUS.COMPLETED,
    title: 'Completed',
    description: 'Finished and closed orders',
  },
];

const columnAccent: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]: 'from-amber-100/80 to-amber-50/60 border-amber-200/60',
  [ORDER_STATUS.PREPARING]: 'from-sky-100/80 to-sky-50/60 border-sky-200/60',
  [ORDER_STATUS.READY]: 'from-emerald-100/80 to-emerald-50/60 border-emerald-200/60',
  [ORDER_STATUS.COMPLETED]: 'from-zinc-100/80 to-zinc-50/60 border-zinc-200/60',
};

const isValidTransition = (current: OrderStatus, next: OrderStatus): boolean => {
  return nextStatusByCurrent[current] === next;
};

export default function KitchenOrdersPage() {
  const [page, setPage] = useState(1);
  const [draggingOrderId, setDraggingOrderId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<OrderStatus | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: DEFAULT_LIMIT,
    }),
    [page],
  );

  const ordersQuery = useOrders(params);
  const updateStatusMutation = useUpdateOrderStatus();

  const orders = useMemo(() => ordersQuery.data?.data.data ?? [], [ordersQuery.data]);
  const pagination = ordersQuery.data?.data.pagination;

  const ordersByStatus = useMemo(() => {
    const groups: Record<OrderStatus, typeof orders> = {
      [ORDER_STATUS.PENDING]: [],
      [ORDER_STATUS.PREPARING]: [],
      [ORDER_STATUS.READY]: [],
      [ORDER_STATUS.COMPLETED]: [],
    };

    for (const order of orders) {
      const key = order.status as OrderStatus;
      if (groups[key]) {
        groups[key].push(order);
      }
    }

    return groups;
  }, [orders]);

  const moveOrderToStatus = (orderId: string, targetStatus: OrderStatus) => {
    const order = orders.find((entry) => entry.id === orderId);
    if (!order) {
      return;
    }

    const currentStatus = order.status as OrderStatus;
    if (currentStatus === targetStatus) {
      return;
    }

    if (!isValidTransition(currentStatus, targetStatus)) {
      toast.error('Invalid move. Orders can only move forward one step.');
      return;
    }

    updateStatusMutation.mutate({
      id: order.id,
      payload: { status: targetStatus },
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 min-h-full bg-gradient-to-b from-muted/30 via-background to-background">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kitchen Board</h1>
        <p className="text-sm text-muted-foreground">
          Drag orders across columns to progress their status, Jira style.
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
          <div className="grid gap-4 lg:grid-cols-4">
            {statusColumns.map((column) => {
              const isDragOver = dragOverColumn === column.key;
              const columnOrders = ordersByStatus[column.key] ?? [];

              return (
                <section
                  key={column.key}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverColumn(column.key);
                  }}
                  onDragLeave={() =>
                    setDragOverColumn((value) => (value === column.key ? null : value))
                  }
                  onDrop={(event) => {
                    event.preventDefault();
                    const droppedOrderId =
                      event.dataTransfer.getData('text/order-id') || draggingOrderId;
                    setDragOverColumn(null);
                    setDraggingOrderId(null);

                    if (droppedOrderId) {
                      moveOrderToStatus(droppedOrderId, column.key);
                    }
                  }}
                  className={
                    'rounded-xl border bg-gradient-to-b p-3 transition-all ' +
                    columnAccent[column.key] +
                    (isDragOver ? ' ring-2 ring-primary/50 shadow-lg scale-[1.01]' : ' shadow-sm')
                  }
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wide">
                        {column.title}
                      </h2>
                      <p className="text-xs text-muted-foreground">{column.description}</p>
                    </div>
                    <span className="rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium">
                      {columnOrders.length}
                    </span>
                  </div>

                  <div className="space-y-2 min-h-24">
                    {columnOrders.length === 0 ? (
                      <div className="rounded-lg border border-dashed bg-background/60 px-3 py-5 text-center text-xs text-muted-foreground">
                        Drop order here
                      </div>
                    ) : (
                      columnOrders.map((order) => {
                        const status = order.status as OrderStatus;
                        const canDrag = status !== ORDER_STATUS.COMPLETED;
                        const isDragging = draggingOrderId === order.id;

                        return (
                          <Card
                            key={order.id}
                            draggable={canDrag && !updateStatusMutation.isPending}
                            onDragStart={(event) => {
                              if (!canDrag) {
                                event.preventDefault();
                                return;
                              }
                              event.dataTransfer.setData('text/order-id', order.id);
                              setDraggingOrderId(order.id);
                            }}
                            onDragEnd={() => {
                              setDraggingOrderId(null);
                              setDragOverColumn(null);
                            }}
                            className={
                              'cursor-grab border-background/80 bg-background/85 shadow-sm backdrop-blur active:cursor-grabbing ' +
                              (isDragging ? 'opacity-50 scale-[0.98]' : 'opacity-100') +
                              (!canDrag ? ' cursor-default' : '')
                            }
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-semibold leading-none">
                                #{order.orderNumber}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1 text-xs text-muted-foreground">
                              <p className="font-medium text-foreground">
                                ${order.total.toFixed(2)}
                              </p>
                              <p>
                                {new Date(order.createdAt).toLocaleString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                              {status === ORDER_STATUS.COMPLETED ? (
                                <p className="text-[11px] font-medium text-muted-foreground">
                                  Completed orders are locked
                                </p>
                              ) : null}
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </section>
              );
            })}
          </div>

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
