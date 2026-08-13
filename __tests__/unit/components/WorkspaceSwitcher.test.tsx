import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { WorkspaceSwitcher } from '@/core/workspaces/components/WorkspaceSwitcher';
import { WorkspaceProvider } from '@/core/workspaces/components/WorkspaceProvider';

const setActiveWorkspaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock('@/core/workspaces/actions', () => ({
  setActiveWorkspace: (...args: unknown[]) => setActiveWorkspaceMock(...args),
}));

describe('WorkspaceSwitcher', () => {
  beforeEach(() => {
    setActiveWorkspaceMock.mockClear();
  });

  it('switches to another workspace when clicking a menu item', async () => {
    render(
      <WorkspaceProvider
        initialWorkspace={{
          id: 'ws-a',
          name: 'Workspace A',
          slug: 'workspace-a',
          createdAt: new Date(),
          updatedAt: new Date(),
          isArchived: false,
          deletedAt: null,
          image: null,
        }}
        initialRole="ADMIN"
        workspaces={[
          { id: 'ws-a', name: 'Workspace A', role: 'ADMIN' },
          { id: 'ws-b', name: 'Workspace B', role: 'VIEWER' },
        ]}
      >
        <WorkspaceSwitcher />
      </WorkspaceProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /workspace a/i }));
    fireEvent.click(await screen.findByText('Workspace B'));

    expect(setActiveWorkspaceMock).toHaveBeenCalledWith('ws-b');
  });
});
