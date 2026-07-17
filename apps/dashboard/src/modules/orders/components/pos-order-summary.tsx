import { Button } from '@srms/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@srms/ui/components/card';
import { PosCartPanel } from '@/modules/orders/components/pos-cart-panel';

type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
};

type PosOrderSummaryProps = {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  canSubmit: boolean;
  isSubmitting: boolean;
  onDecrement: (menuItemId: string) => void;
  onIncrement: (menuItemId: string) => void;
  onRemove: (menuItemId: string) => void;
  onUpdateNotes: (menuItemId: string, notes?: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  highlightToken?: number;
};

export function PosOrderSummary({
  items,
  subtotal,
  tax,
  total,
  canSubmit,
  isSubmitting,
  onDecrement,
  onIncrement,
  onRemove,
  onUpdateNotes,
  onClear,
  onSubmit,
  highlightToken,
}: PosOrderSummaryProps) {
  const highlightClass =
    highlightToken && highlightToken > 0
      ? highlightToken % 2 === 0
        ? 'ring-2 ring-primary/45 shadow-lg -translate-y-0.5 animate-[pulse_380ms_ease-in-out_1]'
        : 'ring-2 ring-primary/45 shadow-lg -translate-y-0.5 animate-[bounce_320ms_ease-out_1]'
      : 'ring-0 shadow-sm';

  return (
    <Card className={'transition-all duration-300 ' + highlightClass}>
      <CardHeader>
        <CardTitle>Current Order</CardTitle>
        <CardDescription>Review, adjust quantities, and place the order.</CardDescription>
      </CardHeader>

      <CardContent className="grow flex flex-col gap-4 overflow-hidden">
        <PosCartPanel
          items={items}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          onRemove={onRemove}
          onUpdateNotes={onUpdateNotes}
        />
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-3 mt-auto">
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={items.length === 0}
            onClick={onClear}
          >
            Clear
          </Button>
          <Button className="flex-1" disabled={!canSubmit || isSubmitting} onClick={onSubmit}>
            {isSubmitting ? 'Placing...' : 'Place Order'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
