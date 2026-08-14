'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Workspace, Role } from '@prisma/client';

export type WorkspaceContextType = {
  activeWorkspace: Workspace | null;
  role: Role | null;
  canCreateDelete: boolean;
  subscriptionTier: string | null;
  workspaces: Array<{ id: string; name: string; role: Role }>;
};

const WorkspaceContext = createContext<WorkspaceContextType>({
  activeWorkspace: null,
  role: null,
  canCreateDelete: false,
  subscriptionTier: null,
  workspaces: [],
});

export function WorkspaceProvider({
  children,
  initialWorkspace,
  initialRole,
  initialCanCreateDelete = false,
  initialSubscriptionTier = null,
  workspaces,
}: {
  children: ReactNode;
  initialWorkspace: Workspace | null;
  initialRole: Role | null;
  initialCanCreateDelete?: boolean;
  initialSubscriptionTier?: string | null;
  workspaces: Array<{ id: string; name: string; role: Role }>;
}) {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(initialWorkspace);
  const [role, setRole] = useState<Role | null>(initialRole);
  const [canCreateDelete, setCanCreateDelete] = useState<boolean>(initialCanCreateDelete);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(initialSubscriptionTier);

  useEffect(() => {
    setActiveWorkspace(initialWorkspace);
  }, [initialWorkspace]);

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    setCanCreateDelete(initialCanCreateDelete);
  }, [initialCanCreateDelete]);

  useEffect(() => {
    setSubscriptionTier(initialSubscriptionTier);
  }, [initialSubscriptionTier]);

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace,
        role,
        canCreateDelete,
        subscriptionTier,
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
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
