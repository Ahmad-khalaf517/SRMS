import { Button } from '@srms/ui/components/button';
import type { KitchenSection } from '@srms/api-contracts';

type DeleteKitchenSectionDialogProps = {
  kitchenSection: KitchenSection;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
};

export function DeleteKitchenSectionDialog({
  kitchenSection,
  onConfirm,
  onCancel,
  isPending,
}: DeleteKitchenSectionDialogProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-foreground">"{kitchenSection.name}"</span>? This action
        cannot be undone.
      </p>
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
          {isPending ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </div>
  );
}
