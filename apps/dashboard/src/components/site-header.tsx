import NAV_LINKS from '@/app/constants/nav-links';
import { ThemeModeToggle } from '@/components/theme-mode-toggle';
import { Separator } from '@srms/ui/components/separator';
import { SidebarTrigger } from '@srms/ui/components/sidebar';
import { useMemo } from 'react';
import { useLocation } from 'react-router';

export function SiteHeader() {
  const location = useLocation();
  const activePath = location.pathname;

  const activePageTitle = useMemo(() => {
    // Logic to determine the active page title based on the current route
    return Object.values(NAV_LINKS.ADMIN).find((item) => item.to === activePath)?.title || '';
  }, [activePath]);

  return (
    <header className="sticky top-0 z-50 w-full py-2 border-gray-200/50 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/70 h-(--header-height) bg-glass shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{activePageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeModeToggle />
        </div>
      </div>
    </header>
  );
}
