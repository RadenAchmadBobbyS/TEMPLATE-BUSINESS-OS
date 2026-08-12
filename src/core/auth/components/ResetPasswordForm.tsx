'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { authClient } from '@/core/auth/auth-client';
import { resetPasswordSchema, ResetPasswordFormData } from '@/core/auth/schemas';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/password-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { CornerMarks, AuthShell } from '@/shared/ui/blueprint';
import { FadeIn } from '@/shared/ui/motion';

export function ResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { error: authError } = await authClient.resetPassword({ newPassword: data.password });
      if (authError) {
        setError(authError.message || 'Failed to reset password');
        setIsLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  }

  return (
    <AuthShell eyebrow="RESET PASSWORD">
      <FadeIn>
        <Card className="relative w-full rounded-none border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0px_var(--ink)]">
          <CornerMarks />
          <CardHeader className="space-y-1">
            <CardTitle
              className="text-center text-2xl font-semibold tracking-tight font-display" style={{ color: 'var(--ink)' }}
            >
              Reset Password
            </CardTitle>
            <CardDescription className="text-center text-sm" style={{ color: 'var(--slate)' }}>
              Enter your new password below
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
                  Password reset successful. Redirecting to login...
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                  {/* Hidden inputs to absorb autofill */}
                  <input type="password" name="fakepasswordreset" className="hidden" aria-hidden="true" tabIndex={-1} />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: '12px',
                            color: 'var(--slate)',
                          }}
                        >
                          NEW PASSWORD
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: '12px',
                            color: 'var(--slate)',
                          }}
                        >
                          CONFIRM PASSWORD
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
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
                    Reset Password
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </AuthShell>
  );
}
