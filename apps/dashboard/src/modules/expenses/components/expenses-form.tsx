import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';
import type { Expenses } from '@srms/api-contracts';
import { CreateExpensesSchema, type CreateExpensesDTO } from '@srms/api-contracts';

type ExpensesFormProps = {
  defaultValues?: Partial<CreateExpensesDTO>;
  onSubmit: (values: CreateExpensesDTO) => void;
  isPending: boolean;
  submitLabel?: string;
};

export function ExpensesForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Save',
}: ExpensesFormProps) {
  const form = useForm<CreateExpensesDTO>({
    resolver: zodResolver(CreateExpensesSchema),
    defaultValues: {
      expenseTypeId: defaultValues?.expenseTypeId ?? '',
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      amount: Number(defaultValues?.amount ?? 0),
      date: defaultValues?.date ?? '',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="exp-title" className="text-sm font-medium">
          Title <span className="text-destructive">*</span>
        </label>
        <Input
          id="exp-title"
          placeholder="e.g. Electricity bill"
          disabled={isPending}
          {...form.register('title')}
        />
        {form.formState.errors.title ? (
          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="exp-type" className="text-sm font-medium">
          Expense Type <span className="text-destructive">*</span>
        </label>
        <Input
          id="exp-type"
          placeholder="Expense type id"
          disabled={isPending}
          {...form.register('expenseTypeId')}
        />
        {form.formState.errors.expenseTypeId ? (
          <p className="text-sm text-destructive">{form.formState.errors.expenseTypeId.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="exp-amount" className="text-sm font-medium">
          Amount <span className="text-destructive">*</span>
        </label>
        <Input
          id="exp-amount"
          type="number"
          step="0.01"
          min="0"
          disabled={isPending}
          {...form.register('amount', { valueAsNumber: true })}
        />
        {form.formState.errors.amount ? (
          <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="exp-date" className="text-sm font-medium">
          Date <span className="text-destructive">*</span>
        </label>
        <Input id="exp-date" type="date" disabled={isPending} {...form.register('date')} />
        {form.formState.errors.date ? (
          <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="exp-desc" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="exp-desc"
          rows={3}
          placeholder="Optional description"
          disabled={isPending}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          {...form.register('description')}
        />
        {form.formState.errors.description ? (
          <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
        ) : null}
      </div>

      <Button type="submit" disabled={isPending} className="self-end">
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}

// Helper to get default values from an existing expense record
// eslint-disable-next-line react-refresh/only-export-components
export function expensesToFormValues(expense: Expenses): Partial<CreateExpensesDTO> {
  return {
    expenseTypeId: expense.expenseTypeId,
    title: expense.title,
    description: expense.description ?? '',
    amount: expense.amount,
    date: expense.date.slice(0, 10),
  };
}
