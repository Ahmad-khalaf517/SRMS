import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@srms/ui/components/dropdown-menu';
import type { Category, KitchenSection, CreateMenuItemDTO } from '@srms/api-contracts';
import { CreateMenuItemSchema } from '@srms/api-contracts';
import { ChevronDownIcon } from 'lucide-react';

import { Field, FieldError, FieldLabel } from '@srms/ui/components/field';

type MenuItemFormProps = {
  defaultValues?: Partial<CreateMenuItemDTO>;
  categories: Category[];
  kitchenSections: KitchenSection[];
  // eslint-disable-next-line no-unused-vars
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
              <FieldLabel htmlFor="categoryId">Category</FieldLabel>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      id="categoryId"
                      type="button"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      className="flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
                    >
                      <span className={field.value ? '' : 'text-muted-foreground'}>
                        {categories.find((category) => category.id === field.value)?.name ??
                          'Select category'}
                      </span>
                      <ChevronDownIcon className="size-4 text-muted-foreground" />
                    </button>
                  }
                ></DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--anchor-width)">
                  <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                    {categories.map((category) => (
                      <DropdownMenuRadioItem key={category.id} value={category.id}>
                        {category.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      id="kitchenSectionId"
                      type="button"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      className="flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
                    >
                      <span className={field.value ? '' : 'text-muted-foreground'}>
                        {kitchenSections.find((section) => section.id === field.value)?.name ??
                          'Select kitchen section'}
                      </span>
                      <ChevronDownIcon className="size-4 text-muted-foreground" />
                    </button>
                  }
                ></DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--anchor-width)">
                  <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                    {kitchenSections.map((section) => (
                      <DropdownMenuRadioItem key={section.id} value={section.id}>
                        {section.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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
