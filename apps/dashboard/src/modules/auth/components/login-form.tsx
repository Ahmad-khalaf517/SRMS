import { cn } from '@srms/ui/lib/utils';
import { Button } from '@srms/ui/components/button';
import { LoginSchema } from '@srms/api-contracts/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@srms/ui/components/field';
import { Input } from '@srms/ui/components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  SelectContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from '@srms/ui/components/select';
const items = [
  { label: 'Next.js', value: 'next' },
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
];
import { useLogin } from '@/modules/auth/hooks/use-login';
import { Link } from 'react-router';

type LoginFormValues = z.infer<typeof LoginSchema>;

export default function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const loginMutation = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values);
    } catch {
      /* empty */
    }
  });

  return (
    <form className={cn('flex flex-col gap-6', className)} onSubmit={onSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <Select items={items}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            disabled={loginMutation.isPending}
            {...form.register('email')}
          />
          {form.formState.errors.email ? (
            <FieldDescription className="text-red-500">
              {form.formState.errors.email.message}
            </FieldDescription>
          ) : null}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            disabled={loginMutation.isPending}
            {...form.register('password')}
          />
          {form.formState.errors.password ? (
            <FieldDescription className="text-red-500">
              {form.formState.errors.password.message}
            </FieldDescription>
          ) : null}
        </Field>
        <Field>
          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
