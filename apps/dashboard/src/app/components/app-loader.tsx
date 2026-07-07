import { Skeleton } from '@srms/ui/components/skeleton';

export function AppLoader() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r lg:block">
          <div className="space-y-4 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <Skeleton className="mb-3 h-8 w-56" />
              <Skeleton className="h-4 w-80" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border p-4 space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-6">
              <Skeleton className="mb-4 h-6 w-48" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
