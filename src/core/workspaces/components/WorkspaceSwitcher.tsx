"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Globe, Plus, Settings } from "lucide-react";
import { useWorkspace } from "./WorkspaceProvider";
import { setActiveWorkspace } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function WorkspaceSwitcher() {
  const { activeWorkspace, workspaces } = useWorkspace();
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();

  if (!activeWorkspace) return null;

  const handleSwitch = async (id: string) => {
    if (id === activeWorkspace.id) return;
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
      <DropdownMenuTrigger render={
        <button
          className="flex items-center gap-2 font-semibold w-full px-2 py-1.5 text-left rounded-md hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={isSwitching}
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Globe className="h-4 w-4" />
          </div>
          <span className="truncate flex-1">{activeWorkspace.name}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      } />
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onSelect={() => handleSwitch(ws.id)}
            className="flex items-center justify-between"
          >
            <span className="truncate">{ws.name}</span>
            {activeWorkspace.id === ws.id && <Check className="h-4 w-4 shrink-0" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem render={
          <Link href="/settings/workspace" className="flex items-center w-full">
            <Settings className="mr-2 h-4 w-4" />
            Workspace Settings
          </Link>
        } />
        <DropdownMenuItem render={
          <Link href="/dashboard/workspaces/new" className="flex items-center w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </Link>
        } />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
