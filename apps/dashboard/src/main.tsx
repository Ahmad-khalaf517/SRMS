import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import '@srms/ui/globals.css';
import ThemeProvider from '@/app/providers/theme-provider.tsx';
import AppRoutes from '@/app/routes/app-routes.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
