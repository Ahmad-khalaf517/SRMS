import { ChartAreaInteractive } from '@/modules/dashboard/components/chart-area-interactive';
import { OrderAnalyticsCards } from '@/modules/orders/components/order-analytics-cards';
import { OrdersTable } from '@/modules/orders/components/order-table';
import { useOrderMetrics, useTopSellingItems } from '@/modules/orders/hooks';

export default function DashboardPage() {
  const metricsQuery = useOrderMetrics({});
  const topSellingQuery = useTopSellingItems({ limit: 5 });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <OrderAnalyticsCards
            metrics={metricsQuery.data?.data}
            topSellingItems={topSellingQuery.data?.data}
            isLoading={metricsQuery.isLoading || topSellingQuery.isLoading}
          />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <div className="px-4 lg:px-6">
            <OrdersTable />
          </div>
        </div>
      </div>
    </div>
  );
}
