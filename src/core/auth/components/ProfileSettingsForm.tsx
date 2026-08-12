'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/core/auth/auth-client';
import { useToast } from '@/shared/hooks/use-toast';
import { profileUpdateSchema, ProfileUpdateInput } from '@/core/auth/profile-schema';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { CornerMarks } from '@/shared/ui/blueprint';

const labelClass = 'font-data text-xs uppercase tracking-wider';
const labelStyle = { color: 'var(--slate)' };

export function ProfileSettingsForm() {
  const { data: session } = authClient.useSession();
  const { toast } = useToast();

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: session?.user?.name || '',
      image: session?.user?.image || '',
    },
  });

  const onSubmit = async (data: ProfileUpdateInput) => {
    try {
      await authClient.updateUser({
        name: data.name,
        image: data.image || undefined,
      });
      toast({ title: 'Profile updated successfully' });
    } catch (error: any) {
      toast({
        title: 'Failed to update profile',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-8">
      <Card className="relative rounded-none border-2 border-[var(--ink)] bg-[var(--paper)] shadow-[4px_4px_0px_var(--ink)]">
        <CornerMarks />
        <CardHeader>
          <CardTitle className="font-display" style={{ color: 'var(--ink)' }}>
            Personal Profile
          </CardTitle>
          <CardDescription style={{ color: 'var(--slate)' }}>
            Manage your personal details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-4">
              <FormItem>
                <FormLabel className={labelClass} style={labelStyle}>
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    disabled
                    value={session.user.email}
                    className="rounded-none border-2 border-[var(--ink)]"
                    style={{ backgroundColor: 'var(--line)' }}
                  />
                </FormControl>
                <p className="mt-1 text-xs" style={{ color: 'var(--slate)' }}>
                  Email cannot be changed directly.
                </p>
              </FormItem>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass} style={labelStyle}>
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        className="rounded-none border-2 border-[var(--ink)] focus-visible:ring-[var(--signal)]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass} style={labelStyle}>
                      Profile Image URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="https://example.com/avatar.png"
                        className="rounded-none border-2 border-[var(--ink)] focus-visible:ring-[var(--signal)]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="rounded-none border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                style={{ backgroundColor: 'var(--signal)', color: '#fff' }}
              >
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
