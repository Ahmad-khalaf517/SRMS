import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';
import {
  CreateExpensesTypesSchema,
  type CreateExpensesTypesDTO,
  type ExpensesTypes,
} from '@srms/api-contracts';

type ExpensesTypesFormProps = {
  defaultValues?: Partial<CreateExpensesTypesDTO>;
  onSubmit: (values: CreateExpensesTypesDTO) => void;
  isPending: boolean;
  submitLabel?: string;
};

export function ExpensesTypesForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Save',
}: ExpensesTypesFormProps) {
  const form = useForm<CreateExpensesTypesDTO>({
    resolver: zodResolver(CreateExpensesTypesSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      isActive: defaultValues?.isActive ?? true,
      code: defaultValues?.code ?? '',
      color: defaultValues?.color ?? '#000000',
      icon: defaultValues?.icon ?? '',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cat-name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="cat-name"
          placeholder="e.g. Pizza"
          disabled={isPending}
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cat-desc" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="cat-desc"
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
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cat-desc" className="text-sm font-medium">
          is Active
        </label>
        <textarea
          id="cat-desc"
          rows={3}
          placeholder="Optional description"
          disabled={isPending}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          {...form.register('isActive')}
        />
        {form.formState.errors.isActive ? (
          <p className="text-sm text-isActive">{form.formState.errors.isActive.message}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cat-desc" className="text-sm font-medium">
          code
        </label>
        <textarea
          id="cat-desc"
          rows={3}
          placeholder="Optional code"
          disabled={isPending}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          {...form.register('code')}
        />
        {form.formState.errors.code ? (
          <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cat-desc" className="text-sm font-medium">
          color
        </label>
        <textarea
          id="cat-desc"
          rows={3}
          placeholder="Optional color"
          disabled={isPending}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          {...form.register('color')}
        />
        {form.formState.errors.color ? (
          <p className="text-sm text-destructive">{form.formState.errors.color.message}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cat-desc" className="text-sm font-medium">
          icon
        </label>
        <textarea
          id="cat-desc"
          rows={3}
          placeholder="Optional icon"
          disabled={isPending}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          {...form.register('icon')}
        />
        {form.formState.errors.icon ? (
          <p className="text-sm text-destructive">{form.formState.errors.icon.message}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending} className="self-end">
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}

// Helper to get default values from an existing category record
// eslint-disable-next-line react-refresh/only-export-components
export function expensesTypesToFormValues(
  expensesType: ExpensesTypes,
): Partial<CreateExpensesTypesDTO> {
  return {
    name: expensesType.name,
    description: expensesType.description ?? '',
    code: expensesType.code ?? '',
    color: expensesType.color ?? '',
    icon: expensesType.icon ?? '',
  };
}
