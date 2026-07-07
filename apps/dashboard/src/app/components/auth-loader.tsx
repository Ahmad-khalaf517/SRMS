import { Loader2 } from 'lucide-react';

export function AuthLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>

        <div className="space-y-1 text-center">
          <h2 className="font-semibold">Preparing your workspace</h2>
          <p className="text-sm text-muted-foreground">
            Checking authentication and loading your data...
          </p>
        </div>
      </div>
    </div>
  );
}
