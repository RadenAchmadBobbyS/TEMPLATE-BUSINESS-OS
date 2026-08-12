'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { authClient } from '@/core/auth/auth-client';
import { loginSchema, LoginFormData } from '@/core/auth/schemas';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/password-input';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { CornerMarks, AuthShell } from '@/shared/ui/blueprint';
import { FadeIn } from '@/shared/ui/motion';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    setError(null);
    try {
      const { error: authError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      if (authError) {
        setError(authError.message || 'Invalid credentials');
        setIsLoading(false);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  }

  async function onGoogleSignIn() {
    await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' });
  }

  return (
    <AuthShell eyebrow="SIGN IN">
      <FadeIn>
        <Card className="relative w-full rounded-none border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0px_var(--ink)]">
          <CornerMarks />
          <CardHeader className="space-y-1">
            <CardTitle
              className="text-center text-2xl font-semibold tracking-tight font-display" style={{ color: 'var(--ink)' }}
            >
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-sm" style={{ color: 'var(--slate)' }}>
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 rounded-none">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                {/* Hidden inputs to absorb autofill */}
                <input
                  type="email"
                  name="fakeusernameremembered"
                  className="hidden"
                  aria-hidden="true"
                  tabIndex={-1}
                />
                <input
                  type="password"
                  name="fakepasswordremembered"
                  className="hidden"
                  aria-hidden="true"
                  tabIndex={-1}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '12px',
                          color: 'var(--slate)',
                        }}
                      >
                        EMAIL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="m@example.com"
                          type="email"
                          disabled={isLoading}
                          className="h-11 rounded-none border-[var(--line)] focus-visible:ring-[var(--signal)]"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: '12px',
                            color: 'var(--slate)',
                          }}
                        >
                          PASSWORD
                        </FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs hover:underline"
                          style={{ color: 'var(--signal)' }}
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <PasswordInput
                          placeholder="enter your password"
                          disabled={isLoading}
                          className="h-11 rounded-none border-[var(--line)] focus-visible:ring-[var(--signal)]"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">Remember me</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="h-12 w-full rounded-none text-sm font-medium transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign In
                </Button>
              </form>
            </Form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" style={{ borderColor: 'var(--line)' }} />
              </div>
              <div
                className="relative flex justify-center text-xs uppercase font-data"
              >
                <span
                  className="px-2"
                  style={{ backgroundColor: 'var(--paper)', color: 'var(--slate)' }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="h-11 w-full rounded-none border-[var(--line)] hover:bg-[var(--ink)]/5"
              onClick={onGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </CardContent>
          <CardFooter
            className="flex justify-center border-t pt-6"
            style={{ borderColor: 'var(--line)' }}
          >
            <p className="text-sm" style={{ color: 'var(--slate)' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium hover:underline"
                style={{ color: 'var(--signal)' }}
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </FadeIn>
    </AuthShell>
  );
}
