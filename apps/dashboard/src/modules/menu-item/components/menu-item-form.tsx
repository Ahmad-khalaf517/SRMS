import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';

import type { Category, KitchenSection, CreateMenuItemDTO } from '@srms/api-contracts';
import { CreateMenuItemSchema } from '@srms/api-contracts';

import { Field, FieldError, FieldLabel } from '@srms/ui/components/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@srms/ui/components/select';
import { getSelectOptions } from '@/lib/select-options';
import { useMemo } from 'react';

type MenuItemFormProps = {
  defaultValues?: Partial<CreateMenuItemDTO>;
  categories: Category[];
  kitchenSections: KitchenSection[];
  onSubmit: (values: CreateMenuItemDTO) => void;
  isPending: boolean;
  submitLabel?: string;
};

export function MenuItemForm({
  defaultValues,
  categories,
  kitchenSections,
  onSubmit,
  isPending,
  submitLabel = 'Save',
}: MenuItemFormProps) {
  const form = useForm<CreateMenuItemDTO>({
    resolver: zodResolver(CreateMenuItemSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      price: Number(defaultValues?.price ?? 0),
      categoryId: defaultValues?.categoryId ?? '',
      kitchenSectionId: defaultValues?.kitchenSectionId ?? '',
      isAvailable: defaultValues?.isAvailable ?? true,
    },
  });

  const categoryOptions = useMemo(
    () => getSelectOptions(categories, { label: 'name', value: 'id' }),
    [categories],
  );
  const kitchenSectionOptions = useMemo(
    () => getSelectOptions(kitchenSections, { label: 'name', value: 'id' }),
    [kitchenSections],
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="mi-name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="mi-name"
          placeholder="e.g. Margherita Pizza"
          disabled={isPending}
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mi-desc" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="mi-desc"
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
        <label htmlFor="mi-price" className="text-sm font-medium">
          Price <span className="text-destructive">*</span>
        </label>
        <Input
          id="mi-price"
          type="number"
          step="0.01"
          min="0"
          disabled={isPending}
          {...form.register('price', { valueAsNumber: true })}
        />
        {form.formState.errors.price ? (
          <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Controller
          name="categoryId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="categoryId">
                Category <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                items={categoryOptions}
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="categoryId"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Controller
          name="kitchenSectionId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="kitchenSectionId">
                Kitchen Section <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                items={kitchenSectionOptions}
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="kitchenSectionId"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {kitchenSectionOptions.map((section) => (
                    <SelectItem key={section.value} value={section.value}>
                      {section.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" disabled={isPending} {...form.register('isAvailable')} />
        Available for ordering
      </label>

      <Button type="submit" disabled={isPending} className="self-end">
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
