import { Outlet } from 'react-router';

export function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Outlet />
    </div>
  );
}
