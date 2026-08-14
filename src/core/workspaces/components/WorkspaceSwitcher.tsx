'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Globe, Plus, Settings, Archive, ShieldAlert } from 'lucide-react';
import { useWorkspace } from './WorkspaceProvider';
import { setActiveWorkspace } from '../actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/shared/ui/tooltip';

const DANGER = '#dc2626';

export function WorkspaceSwitcher() {
  const { activeWorkspace, workspaces, role, subscriptionTier } = useWorkspace();
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();

  const isFree = !subscriptionTier || subscriptionTier === 'FREE';
  const ownedCount = workspaces.filter((w) => w.role === 'OWNER').length;
  const quotaExceeded = isFree && ownedCount >= 1;

  const handleSwitch = async (id: string) => {
    if (id === activeWorkspace?.id) return;
    setIsSwitching(true);
    try {
      await setActiveWorkspace(id);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className="font-display flex w-full items-center gap-2 rounded-none border-2 px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            style={{
              borderColor: 'var(--ink)',
              backgroundColor: 'var(--paper)',
              color: 'var(--ink)',
            }}
            disabled={isSwitching}
          >
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center border-2"
              style={{
                backgroundColor: 'var(--signal)',
                borderColor: 'var(--ink)',
                color: '#fff',
              }}
            >
              <Globe className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
              <span className="truncate leading-none">
                {activeWorkspace ? activeWorkspace.name : 'Select Workspace'}
              </span>
              {activeWorkspace && (
                <div className="flex items-center gap-1">
                  <span className="font-data text-[8px] font-bold tracking-wider text-[var(--slate)] uppercase">
                    {role}
                  </span>
                  {subscriptionTier && (
                    <>
                      <span className="text-[var(--slate)] opacity-50">&bull;</span>
                      <span className="font-data text-[8px] font-bold tracking-wider text-[var(--signal)] uppercase">
                        {subscriptionTier}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        }
      />
      <DropdownMenuContent
        className="border-ink bg-paper w-56 rounded-none border-2 shadow-[4px_4px_0px_var(--ink)]"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-data text-slate text-[10px] tracking-wider uppercase">
            Workspaces
          </DropdownMenuLabel>
          {workspaces.map((ws) => (
            <DropdownMenuItem
              key={ws.id}
              onClick={() => handleSwitch(ws.id)}
              className="flex cursor-pointer items-center justify-between rounded-none font-medium focus:bg-black/5"
            >
              <span className="truncate">{ws.name}</span>
              {activeWorkspace?.id === ws.id && (
                <Check className="h-4 w-4 shrink-0" style={{ color: 'var(--signal)' }} />
              )}
            </DropdownMenuItem>
          ))}
          {workspaces.length === 0 && (
            <div className="text-slate px-2 py-2 text-sm italic">No workspaces found</div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link
              href="/dashboard/settings/workspace"
              className="flex w-full cursor-pointer items-center rounded-none font-medium focus:bg-black/5"
            >
              <Settings className="mr-2 h-4 w-4" />
              Workspace Settings
            </Link>
          }
        />

        {quotaExceeded ? (
          <DropdownMenuItem
            className="flex w-full cursor-not-allowed items-center justify-between rounded-none font-medium opacity-60 focus:bg-transparent"
            onClick={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
            }}
          >
            <span className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Workspace
            </span>

            {/* Tooltip anchored to the icon itself, not the whole row */}
            <TooltipProvider delay={100}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center"
                      style={{ color: DANGER }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ShieldAlert className="h-4 w-4" strokeWidth={2.25} />
                    </span>
                  }
                />
                <TooltipContent
                  side="right"
                  align="center"
                  sideOffset={14}
                  accentColor={DANGER}
                  className="max-w-xs p-0"
                >
                  <div
                    className="font-data flex items-center gap-1.5 border-b-2 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase"
                    style={{
                      borderColor: DANGER,
                      backgroundColor: `color-mix(in srgb, ${DANGER} 12%, var(--paper))`,
                      color: DANGER,
                    }}
                  >
                    <ShieldAlert className="h-3 w-3" />
                    Quota Exceeded
                  </div>
                  <div className="space-y-2 p-3">
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--ink)' }}>
                      Kamu sudah mencapai batas maksimum{' '}
                      <span className="font-semibold">1 workspace</span> untuk paket FREE. Upgrade
                      untuk membuat lebih banyak.
                    </p>
                    <Link
                      href="/dashboard/billing"
                      className="font-data inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase underline underline-offset-2 transition-colors hover:opacity-70"
                      style={{ color: DANGER }}
                    >
                      View Subscription Plans
                    </Link>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            render={
              <Link
                href="/dashboard/workspaces/new"
                className="flex w-full cursor-pointer items-center rounded-none font-medium focus:bg-black/5"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </Link>
            }
          />
        )}

        <DropdownMenuItem
          render={
            <Link
              href="/dashboard/workspaces/archived"
              className="flex w-full cursor-pointer items-center rounded-none font-medium focus:bg-black/5"
            >
              <Archive className="mr-2 h-4 w-4" />
              Archived Workspaces
            </Link>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
