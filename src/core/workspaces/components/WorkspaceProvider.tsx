"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Workspace, Role } from "@prisma/client";

export type WorkspaceContextType = {
  activeWorkspace: Workspace | null;
  role: Role | null;
  workspaces: Array<{ id: string; name: string; role: Role }>;
};

const WorkspaceContext = createContext<WorkspaceContextType>({
  activeWorkspace: null,
  role: null,
  workspaces: [],
});

export function WorkspaceProvider({
  children,
  initialWorkspace,
  initialRole,
  workspaces,
}: {
  children: ReactNode;
  initialWorkspace: Workspace | null;
  initialRole: Role | null;
  workspaces: Array<{ id: string; name: string; role: Role }>;
}) {
  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace: initialWorkspace,
        role: initialRole,
        workspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
