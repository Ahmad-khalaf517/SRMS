import { Button } from '@srms/ui/components/button';
import type { ExpensesTypes } from '@srms/api-contracts';

type DeleteExpensesTypesDialogProps = {
  expensesType: ExpensesTypes;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
};

export function DeleteExpensesTypesDialog({
  expensesType,
  onConfirm,
  onCancel,
  isPending,
}: DeleteExpensesTypesDialogProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-foreground">"{expensesType.name}"</span>? This action
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
