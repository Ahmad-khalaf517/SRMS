import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import '@srms/ui/globals.css';
import ThemeProvider from '@/app/providers/theme-provider.tsx';
import AppRoutes from '@/app/routes/app-routes.tsx';
import { setupAuthInterceptors } from '@/modules/auth/api/client';

const queryClient = new QueryClient();

setupAuthInterceptors(queryClient);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="srms-ui-theme">
        <BrowserRouter>
          <AppRoutes />
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
