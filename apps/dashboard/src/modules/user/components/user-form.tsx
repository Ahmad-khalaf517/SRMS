import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';
import type { User } from '@srms/api-contracts';
import { CreateUserSchema, type CreateUserDTO } from '@srms/api-contracts/user';

type UserFormProps = {
  defaultValues?: Partial<CreateUserDTO>;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: CreateUserDTO) => void;
  isPending: boolean;
  submitLabel?: string;
};

export function UserForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Save',
}: UserFormProps) {
  const form = useForm<CreateUserDTO>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
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
          {...form.register('email')}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <Button type="submit" disabled={isPending} className="self-end">
        {isPending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}

// Helper to get default values from an existing user record
 
export function UserToFormValues(user: User): Partial<CreateUserDTO> {
  return { name: user.name, email: user.email ?? '' };
}
