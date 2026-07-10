import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';

type PosCartItemRowProps = {
  item: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  };
  onDecrement: (menuItemId: string) => void;
  onIncrement: (menuItemId: string) => void;
  onRemove: (menuItemId: string) => void;
  onUpdateNotes: (menuItemId: string, notes?: string) => void;
};

export function PosCartItemRow({
  item,
  onDecrement,
  onIncrement,
  onRemove,
  onUpdateNotes,
}: PosCartItemRowProps) {
  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
        </div>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={`Remove ${item.name}`}
          onClick={() => onRemove(item.menuItemId)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon-sm"
          variant="outline"
          aria-label={`Decrease ${item.name} quantity`}
          onClick={() => onDecrement(item.menuItemId)}
        >
          <Minus className="size-4" />
        </Button>
        <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
        <Button
          size="icon-sm"
          variant="outline"
          aria-label={`Increase ${item.name} quantity`}
          onClick={() => onIncrement(item.menuItemId)}
        >
          <Plus className="size-4" />
        </Button>
        <span className="ml-auto text-sm font-medium">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>

      <Input
        value={item.notes ?? ''}
        onChange={(event) => onUpdateNotes(item.menuItemId, event.target.value)}
        placeholder="Optional note (e.g. no onions)"
      />
    </div>
  );
}
