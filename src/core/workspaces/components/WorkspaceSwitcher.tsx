'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Globe, Plus, Settings } from 'lucide-react';
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

export function WorkspaceSwitcher() {
  const { activeWorkspace, workspaces } = useWorkspace();
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();

  const handleSwitch = async (id: string) => {
    if (id === activeWorkspace?.id) return;
    setIsSwitching(true);
    try {
      await setActiveWorkspace(id);
      router.refresh(); // Or router.push('/dashboard') depending on desired behavior
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
            <span className="flex-1 truncate">
              {activeWorkspace ? activeWorkspace.name : 'Select Workspace'}
            </span>
            <span className="font-data bg-ink text-paper inline-flex h-5 items-center justify-center rounded-none px-1.5 text-[10px]">
              {workspaces.length}
            </span>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
