import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@srms/ui/components/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@srms/ui/components/card';
import type { MenuItemListItem } from '@srms/api-contracts';

type PosMenuBrowserProps = {
  menuItems: MenuItemListItem[];
  isLoading: boolean;
  onAddItem: (item: MenuItemListItem) => void;
};

export function PosMenuBrowser({ menuItems, isLoading, onAddItem }: PosMenuBrowserProps) {
  const [search, setSearch] = useState('');
  const [animatingItemId, setAnimatingItemId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return menuItems;
    }

    return menuItems.filter((item) => {
      return (
        item.name.toLowerCase().includes(term) ||
        item.categoryName.toLowerCase().includes(term) ||
        item.kitchenSectionName.toLowerCase().includes(term)
      );
    });
  }, [menuItems, search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu</CardTitle>
        <CardDescription>Search and add available items to the POS cart.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-2 left-2.5 size-4" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, category, or kitchen section"
            className="pl-8"
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading menu items...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No menu items found.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 ">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                size="sm"
                role="button"
                tabIndex={item.isAvailable ? 0 : -1}
                aria-disabled={!item.isAvailable}
                onClick={() => {
                  if (!item.isAvailable) {
                    return;
                  }

                  onAddItem(item);
                  setAnimatingItemId(item.id);
                  window.setTimeout(() => {
                    setAnimatingItemId((current) => (current === item.id ? null : current));
                  }, 420);
                }}
                onKeyDown={(event) => {
                  if (!item.isAvailable) {
                    return;
                  }

                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onAddItem(item);
                    setAnimatingItemId(item.id);
                    window.setTimeout(() => {
                      setAnimatingItemId((current) => (current === item.id ? null : current));
                    }, 420);
                  }
                }}
                className={
                  'border border-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ' +
                  (item.isAvailable ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed') +
                  (animatingItemId === item.id ? ' translate-x-3 scale-[0.97] opacity-70' : '')
                }
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm">{item.name}</CardTitle>
                  </div>
                  <CardDescription>
                    {item.categoryName} - {item.kitchenSectionName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                  <span className="text-xs text-muted-foreground">
                    {item.isAvailable ? 'Click to add' : 'Unavailable'}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
