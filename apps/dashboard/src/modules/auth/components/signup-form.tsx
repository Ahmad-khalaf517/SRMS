import { cn } from '@srms/ui/lib/utils';
import { Button } from '@srms/ui/components/button';
import { Card, CardContent } from '@srms/ui/components/card';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@srms/ui/components/field';
import { Input } from '@srms/ui/components/input';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { useRegister } from '@/modules/auth/hooks/use-register';
import {
  mapSignupToRegisterPayload,
  SignupFormSchema,
  type SignupFormValues,
} from '@/modules/auth/schemas/register.schema';

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const registerMutation = useRegister();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      restaurant: {
        name: '',
        address: '',
        phone: '',
        email: '',
      },
      user: {
        name: '',
        email: '',
        password: '',
      },
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await registerMutation.mutateAsync(mapSignupToRegisterPayload(values));
    } catch {
      /* empty */
    }
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <FieldGroup className="">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your email below to create your account
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="restaurant-name">Restaurant Name</FieldLabel>
                  <Input
                    id="restaurant-name"
                    disabled={registerMutation.isPending}
                    {...form.register('restaurant.name')}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="restaurant-address">Restaurant Address</FieldLabel>
                  <Input
                    id="restaurant-address"
                    disabled={registerMutation.isPending}
                    {...form.register('restaurant.address')}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="restaurant-phone">Restaurant Phone</FieldLabel>
                <Input
                  id="restaurant-phone"
                  disabled={registerMutation.isPending}
                  {...form.register('restaurant.phone')}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="restaurant-email">Restaurant Email</FieldLabel>
                <Input
                  id="restaurant-email"
                  type="email"
                  placeholder="restaurant@example.com"
                  disabled={registerMutation.isPending}
                  {...form.register('restaurant.email')}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="owner-name">Owner Name</FieldLabel>
                <Input
                  id="owner-name"
                  disabled={registerMutation.isPending}
                  {...form.register('user.name')}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="owner-email">Owner Email</FieldLabel>
                <Input
                  id="owner-email"
                  type="email"
                  placeholder="owner@example.com"
                  disabled={registerMutation.isPending}
                  {...form.register('user.email')}
                />
                <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your email with anyone else.
                </FieldDescription>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="user-password">Password</FieldLabel>
                    <Input
                      id="user-password"
                      type="password"
                      disabled={registerMutation.isPending}
                      {...form.register('user.password')}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      disabled={registerMutation.isPending}
                      {...form.register('confirmPassword')}
                    />
                  </Field>
                </Field>
                {form.formState.errors.confirmPassword ? (
                  <FieldDescription className="text-red-500">
                    {form.formState.errors.confirmPassword.message}
                  </FieldDescription>
                ) : null}
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                </Button>
                {registerMutation.isPending ? (
                  <FieldDescription>Loading, please wait...</FieldDescription>
                ) : null}
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <FieldDescription className="text-center">
                Already have an account? <Link to="/login">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://ui.shadcn.com/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <Link to="/terms-of-service">Terms of Service</Link>{' '}
        and <Link to="/privacy-policy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
