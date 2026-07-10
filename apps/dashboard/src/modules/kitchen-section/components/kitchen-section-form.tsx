import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';
import type { KitchenSection } from '@srms/api-contracts';
import {
  CreateKitchenSectionSchema,
  type CreateKitchenSectionDTO,
} from '@srms/api-contracts/kitchen-section';

type KitchenSectionFormProps = {
  defaultValues?: Partial<CreateKitchenSectionDTO>;
  onSubmit: (values: CreateKitchenSectionDTO) => void;
  isPending: boolean;
  submitLabel?: string;
};

export function KitchenSectionForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Save',
}: KitchenSectionFormProps) {
  const form = useForm<CreateKitchenSectionDTO>({
    resolver: zodResolver(CreateKitchenSectionSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="ks-name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="ks-name"
          placeholder="e.g. Grill"
          disabled={isPending}
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ks-desc" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="ks-desc"
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

// Helper to get default values from an existing kitchen section record
// eslint-disable-next-line react-refresh/only-export-components
export function kitchenSectionToFormValues(
  kitchenSection: KitchenSection,
): Partial<CreateKitchenSectionDTO> {
  return { name: kitchenSection.name, description: kitchenSection.description ?? '' };
}
