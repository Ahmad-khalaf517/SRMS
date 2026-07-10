import { DataTable } from '@/modules/dashboard/components/data-table';
import { ChartAreaInteractive } from '@/modules/dashboard/components/chart-area-interactive';
import { SectionCards } from '@/modules/dashboard/components/section-cards';

import data from '@/templates/dashboard/data.json';

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
