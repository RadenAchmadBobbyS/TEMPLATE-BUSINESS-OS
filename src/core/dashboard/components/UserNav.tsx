'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Settings, User } from 'lucide-react';
import { authClient } from '@/core/auth/auth-client';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Skeleton } from '@/shared/ui/skeleton';

export function UserNav() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!session) {
    return null;
  }

  const initials = session.user.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
          router.refresh();
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full p-0 hover:bg-transparent"
          >
            <Avatar className="h-8 w-8 border-2" style={{ borderColor: 'var(--ink)' }}>
              <AvatarImage src={session.user.image || ''} alt={session.user.name || 'User'} />
              <AvatarFallback
                style={{
                  backgroundColor: 'var(--ink)',
                  color: 'var(--paper)',
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent
        className="w-56 rounded-none border-2"
        align="end"
        style={{ borderColor: 'var(--ink)', boxShadow: '4px 4px 0px var(--ink)' }}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p
              className="text-sm leading-none font-medium font-display" style={{ color: 'var(--ink)' }}
            >
              {session.user.name}
            </p>
            <p
              className="text-xs leading-none font-data" style={{ color: 'var(--slate)' }}
            >
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator style={{ backgroundColor: 'var(--line)' }} />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="rounded-none focus:bg-[rgba(36,81,255,0.08)] cursor-pointer"
            render={<Link href="/dashboard/settings/profile" />}
          >
            <User className="mr-2 h-4 w-4" style={{ color: 'var(--signal)' }} />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-none focus:bg-[rgba(36,81,255,0.08)] cursor-pointer"
            render={<Link href="/dashboard/settings/workspace" />}
          >
            <Settings className="mr-2 h-4 w-4" style={{ color: 'var(--signal)' }} />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator style={{ backgroundColor: 'var(--line)' }} />
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-none cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
