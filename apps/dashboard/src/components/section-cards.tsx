import { Card, CardDescription, CardHeader, CardTitle } from '@srms/ui/components/card';
import { Circle, DollarSign } from 'lucide-react';

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Total Revenue */}
      <Card className="@container/card relative overflow-hidden bg-white border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        {/* Premium violet border glow for financial metrics */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500/80 dark:bg-violet-500" />

        <CardHeader className="p-6">
          <div className="flex items-center justify-between gap-4">
            <CardDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Total Revenue
            </CardDescription>

            {/* Clean Financial Icon Indicator */}
            <div className="flex p-2 items-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>

          {/* Financial Figure */}
          <div className="mt-2 flex items-baseline justify-between gap-2 flex-wrap">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-zinc-50 @[250px]/card:text-4xl">
              $14,284.50
            </CardTitle>

            {/* Modern Trend Indicator (Optional but looks highly professional) */}
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
              +12.3%
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Pending Orders */}
      <Card className="@container/card relative overflow-hidden bg-white border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        {/* Subtle top border glow for Pending */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500/80 dark:bg-amber-500" />

        <CardHeader className="p-6">
          <div className="flex items-center justify-between gap-4">
            <CardDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Pending Orders
            </CardDescription>

            {/* Amber Pill Badge */}
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              <Circle className="h-1.5 w-1.5 fill-current stroke-none text-amber-500 dark:text-amber-400" />
              Awaiting
            </div>
          </div>

          <CardTitle className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-zinc-50 @[250px]/card:text-4xl">
            12
          </CardTitle>
        </CardHeader>
      </Card>
      {/* Ready Orders */}
      <Card className="@container/card relative overflow-hidden bg-white border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        {/* Modern Accent: A subtle top border glow */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/80 dark:bg-emerald-500" />

        <CardHeader className="p-6">
          <div className="flex items-center justify-between gap-4">
            {/* Description / Label */}
            <CardDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Ready Orders
            </CardDescription>

            {/* Modern Status Indicator: A soft pill badge instead of a raw dot */}
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Circle className="h-1.5 w-1.5 fill-current stroke-none text-emerald-600 dark:text-emerald-400" />
              Live
            </div>
          </div>

          {/* Metric Figure */}
          <CardTitle className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-zinc-50 @[250px]/card:text-4xl">
            42
          </CardTitle>
        </CardHeader>
      </Card>
      {/* Total Orders */}
      <Card className="@container/card relative overflow-hidden bg-white border-slate-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        {/* Neutral/Indigo top border glow for Totals */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-500/80 dark:bg-indigo-500" />

        <CardHeader className="p-6">
          <div className="flex items-center justify-between gap-4">
            <CardDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
              Total Orders
            </CardDescription>

            {/* Muted Slate/Indigo Badge */}
            <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
              All Volume
            </div>
          </div>

          <CardTitle className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-zinc-50 @[250px]/card:text-4xl">
            154
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
