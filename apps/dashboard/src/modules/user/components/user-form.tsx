import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { USER_ROLE, CreateUserSchema, type CreateUserDTO } from '@srms/api-contracts/user';
import { Button } from '@srms/ui/components/button';
import { Input } from '@srms/ui/components/input';

type UserFormProps = {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: CreateUserDTO) => void;
  isPending: boolean;
};

export function UserForm({ onSubmit, isPending }: UserFormProps) {
  const form = useForm<CreateUserDTO>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: USER_ROLE.CASHIER,
      isActive: true,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="user-name" className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </label>
        <Input id="user-name" disabled={isPending} {...form.register('name')} />
        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="user-email" className="text-sm font-medium">
          Email <span className="text-destructive">*</span>
        </label>
        <Input id="user-email" type="email" disabled={isPending} {...form.register('email')} />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="user-password" className="text-sm font-medium">
          Password <span className="text-destructive">*</span>
        </label>
        <Input
          id="user-password"
          type="password"
          disabled={isPending}
          {...form.register('password')}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="user-role"
            disabled={isPending}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            {...form.register('role')}
          >
            <option value={USER_ROLE.ADMIN}>Admin</option>
            <option value={USER_ROLE.CASHIER}>Cashier</option>
            <option value={USER_ROLE.KITCHEN_STAFF}>Kitchen Staff</option>
          </select>
        </div>

        <label className="mt-6 flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" disabled={isPending} {...form.register('isActive')} />
          Active account
        </label>
      </div>

      <Button type="submit" disabled={isPending} className="self-end">
        {isPending ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  );
}
