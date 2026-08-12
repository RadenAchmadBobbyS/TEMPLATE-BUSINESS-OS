'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

import { authClient } from '@/core/auth/auth-client';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/core/auth/schemas';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
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

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { error: authError } = await (authClient as any).forgetPassword({
        email: data.email,
        redirectTo: '/reset-password',
      });
      if (authError) {
        setError(authError.message || 'Failed to send reset email');
        setIsLoading(false);
        return;
      }
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  }

  return (
    <AuthShell eyebrow="FORGOT PASSWORD">
      <FadeIn>
        <Card className="relative w-full rounded-none border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0px_var(--ink)]">
          <CornerMarks />
          <CardHeader className="space-y-1">
            <CardTitle
              className="text-center text-2xl font-semibold tracking-tight font-display" style={{ color: 'var(--ink)' }}
            >
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center text-sm" style={{ color: 'var(--slate)' }}>
              Enter your email address and we will send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 rounded-none">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success ? (
              <Alert className="border-opacity-20 mb-4 rounded-none border-[var(--signal)] bg-[rgba(36,81,255,0.06)] text-[var(--signal)]">
                <AlertDescription>
                  If an account exists with that email, a password reset link has been sent.
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                  {/* Hidden inputs to absorb autofill */}
                  <input type="email" name="fakeemailforgot" className="hidden" aria-hidden="true" tabIndex={-1} />

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
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-none text-sm font-medium transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Send Reset Link
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter
            className="flex justify-center border-t pt-6"
            style={{ borderColor: 'var(--line)' }}
          >
            <p className="text-sm" style={{ color: 'var(--slate)' }}>
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-medium hover:underline"
                style={{ color: 'var(--signal)' }}
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </FadeIn>
    </AuthShell>
  );
}
