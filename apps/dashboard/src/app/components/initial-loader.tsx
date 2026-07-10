import { Progress } from '@srms/ui/components/progress';
import { useEffect, useState } from 'react';

export function InitialLoader() {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 12, 90));
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-4 px-6">
        <Progress value={progress} />
      </div>
    </div>
  );
}
