import type { OrderMetrics, TopSellingItem } from '@srms/api-contracts/orders';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@srms/ui/components/card';

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
  if (isLoading) {
    return <p className="px-4 text-sm text-muted-foreground lg:px-6">Loading analytics...</p>;
  }

  return (
    <div className="grid gap-4 px-4 lg:px-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle>{currency.format(metrics?.totalRevenue ?? 0)}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total Orders</CardDescription>
            <CardTitle>{metrics?.totalOrders ?? 0}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Pending Orders</CardDescription>
            <CardTitle>{metrics?.pendingOrders ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
          <CardDescription>Most ordered menu items in the selected range.</CardDescription>
        </CardHeader>
        <CardContent>
          {topSellingItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No top-selling data available for this range.
            </p>
          ) : (
            <div className="space-y-2">
              {topSellingItems.map((item) => (
                <div key={item.menuItemId} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.quantitySold} sold · {currency.format(item.revenueContribution ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
