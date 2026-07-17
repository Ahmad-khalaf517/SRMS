import type { OrderMetrics, TopSellingItem } from '@srms/api-contracts/orders';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@srms/ui/components/card';
import { Skeleton } from '@srms/ui/components/skeleton';
import { Clock, DollarSign, ListOrdered, TrendingUp } from 'lucide-react';

const currency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

type OrderAnalyticsCardsProps = {
  metrics?: OrderMetrics;
  topSellingItems?: TopSellingItem[];
  isLoading?: boolean;
};

export function OrderAnalyticsCards({
  metrics,
  topSellingItems = [],
  isLoading = false,
}: OrderAnalyticsCardsProps) {
  const maxRevenue = Math.max(1, ...topSellingItems.map((item) => item.revenueContribution ?? 0));

  return (
    <div className="grid gap-4 px-4 lg:px-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Revenue */}
        <Card className="@container/card relative overflow-hidden border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-sky-500/80 dark:bg-sky-500" />
          <CardHeader className="p-6">
            <div className="flex items-center justify-between gap-4">
              <CardDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Total Revenue
              </CardDescription>
              <div className="flex items-center rounded-lg bg-sky-50 p-2 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="mt-2 h-9 w-32" />
            ) : (
              <CardTitle className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums @[250px]/card:text-4xl dark:text-zinc-50">
                {currency.format(metrics?.totalRevenue ?? 0)}
              </CardTitle>
            )}
          </CardHeader>
        </Card>

        {/* Total Orders */}
        <Card className="@container/card relative overflow-hidden border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-indigo-500/80 dark:bg-indigo-500" />
          <CardHeader className="p-6">
            <div className="flex items-center justify-between gap-4">
              <CardDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Total Orders
              </CardDescription>
              <div className="flex items-center rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <ListOrdered className="h-4 w-4" />
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="mt-2 h-9 w-16" />
            ) : (
              <CardTitle className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums @[250px]/card:text-4xl dark:text-zinc-50">
                {metrics?.totalOrders ?? 0}
              </CardTitle>
            )}
          </CardHeader>
        </Card>

        {/* Pending Orders */}
        <Card className="@container/card relative overflow-hidden border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-amber-500/80 dark:bg-amber-500" />
          <CardHeader className="p-6">
            <div className="flex items-center justify-between gap-4">
              <CardDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                Pending Orders
              </CardDescription>
              <div className="flex items-center rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="mt-2 h-9 w-16" />
            ) : (
              <CardTitle className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums @[250px]/card:text-4xl dark:text-zinc-50">
                {metrics?.pendingOrders ?? 0}
              </CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>

      {/* Top Selling Items */}
      <Card className="@container/card relative overflow-hidden border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-zinc-50">
                Top Selling Items
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-zinc-400">
                Most ordered menu items in the selected range.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-11 w-full rounded-lg" />
              ))}
            </div>
          ) : topSellingItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No top-selling data available for this range.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
              {topSellingItems.map((item, index) => {
                const share = ((item.revenueContribution ?? 0) / maxRevenue) * 100;
                return (
                  <li
                    key={item.menuItemId}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-slate-900 dark:text-zinc-50">
                          {item.name}
                        </span>
                        <span className="shrink-0 text-sm text-slate-500 dark:text-zinc-400">
                          {item.quantitySold} sold ·{' '}
                          {currency.format(item.revenueContribution ?? 0)}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-violet-500 transition-all"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
