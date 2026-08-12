import { ReactNode } from 'react';
import { SettingsNav } from '@/core/dashboard/components/SettingsNav';
import { StaggerContainer, StaggerItem } from '@/shared/ui/motion';
import { PageHeader } from '@/shared/ui/blueprint';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <StaggerContainer
      className="mx-auto max-w-7xl space-y-2"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <StaggerItem>
        <PageHeader
          eyebrow="CONFIGURATION"
          title="Settings"
          description="Manage your workspace and personal account preferences."
        />
      </StaggerItem>
      <StaggerItem>
        <SettingsNav />
      </StaggerItem>
      <StaggerItem>
        {children}
      </StaggerItem>
    </StaggerContainer>
  );
}
