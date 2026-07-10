import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@srms/ui/components/card';
import { Badge } from '@srms/ui/components/badge';
import type { MenuItemListItem } from '@srms/api-contracts';

type PosMenuBrowserProps = {
  menuItems: MenuItemListItem[];
  isLoading: boolean;
  onAddItem: (item: MenuItemListItem) => void;
  addingItemId?: string | null;
};

export function PosMenuBrowser({
  menuItems,
  isLoading,
  onAddItem,
  addingItemId = null,
}: PosMenuBrowserProps) {
  const [search, setSearch] = useState('');

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
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredItems.map((item) => (
              <Card key={item.id} size="sm" className="border border-border/60">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm">{item.name}</CardTitle>
                    <Badge variant={item.isAvailable ? 'default' : 'secondary'}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <CardDescription>
                    {item.categoryName} - {item.kitchenSectionName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!item.isAvailable || addingItemId === item.id}
                    onClick={() => onAddItem(item)}
                  >
                    {addingItemId === item.id ? 'Adding...' : 'Add'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
