import { ProfileSettingsForm } from '@/core/auth/components/ProfileSettingsForm';
import { Metadata } from 'next';
import { PageHeader } from '@/shared/ui/blueprint';

export const metadata: Metadata = {
  title: 'Profile Settings',
  description: 'Manage your personal profile.',
};

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <ProfileSettingsForm />
    </div>
  );
}
