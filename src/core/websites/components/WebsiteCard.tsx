'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  MoreVertical,
  Settings,
  Copy,
  Archive,
  Trash2,
  Globe,
  MonitorPlay,
  Loader2,
  FileText,
  ListOrdered,
  Database,
  Table,
  Rocket,
  BarChart3,
  Link as LinkIcon,
  Download,
} from 'lucide-react';

import { WebsiteSettingsModal } from './WebsiteSettingsModal';
import {
  deleteWebsite,
  archiveWebsite,
  duplicateWebsite,
  restoreWebsite,
} from '@/core/websites/actions';
import { useToast } from '@/shared/hooks/use-toast';
import Link from 'next/link';

import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { CornerMarks } from '@/shared/ui/blueprint';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Undo } from 'lucide-react';

type Website = {
  id: string;
  name: string;
  domain: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export function WebsiteCard({
  website,
  view = 'grid',
}: {
  website: Website;
  view?: 'grid' | 'list';
}) {
  const { toast } = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleArchive = async () => {
    setIsActionLoading(true);
    try {
      await archiveWebsite(website.id);
      toast({ title: 'Website archived' });
    } catch {
      toast({ title: 'Failed to archive', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsActionLoading(true);
    try {
      await restoreWebsite(website.id);
      toast({ title: 'Website restored' });
    } catch {
      toast({ title: 'Failed to restore', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDuplicate = async () => {
    setIsActionLoading(true);
    try {
      await duplicateWebsite(website.id);
      toast({ title: 'Website duplicated' });
    } catch {
      toast({ title: 'Failed to duplicate', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsActionLoading(true);
    try {
      await deleteWebsite(website.id);
      toast({ title: 'Website deleted permanently' });
      setIsDeleteDialogOpen(false);
    } catch {
      toast({ title: 'Failed to delete', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleExportTemplate = async () => {
    setIsActionLoading(true);
    try {
      const { exportWebsiteToTemplate } = await import('@/core/websites/actions');
      const jsonStr = await exportWebsiteToTemplate(website.id);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${website.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-template.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Template exported successfully' });
    } catch {
      toast({ title: 'Failed to export template', type: 'error' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const cardMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
        <MoreVertical className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={`/dashboard/websites/${website.id}/pages`} />}>
          <FileText className="mr-2 h-4 w-4" /> Pages
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/dashboard/templates?applyTo=${website.id}`} />}>
          <ListOrdered className="mr-2 h-4 w-4" /> Apply Template
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/dashboard/websites/${website.id}/navigation`} />}>
          <ListOrdered className="mr-2 h-4 w-4" /> Navigation
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/dashboard/websites/${website.id}/cms`} />}>
          <Database className="mr-2 h-4 w-4" /> Headless CMS
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/dashboard/websites/${website.id}/forms`} />}>
          <Table className="mr-2 h-4 w-4" /> Forms & Leads
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/dashboard/websites/${website.id}/analytics`} />}>
          <BarChart3 className="mr-2 h-4 w-4" /> Analytics
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/dashboard/websites/${website.id}/redirects`} />}>
          <LinkIcon className="mr-2 h-4 w-4" /> URL Redirects
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={`/dashboard/websites/${website.id}/domains`} />}>
          <Globe className="mr-2 h-4 w-4" /> Domains & SSL
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href={`/dashboard/websites/${website.id}/deploy`} />}>
          <Rocket className="mr-2 h-4 w-4" /> Deploy & Hosting
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={`/dashboard/websites/${website.id}/settings`} />}>
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
          <Settings className="mr-2 h-4 w-4" /> Edit Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportTemplate}>
          <Download className="mr-2 h-4 w-4" /> Export as Template
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {website.deletedAt ? (
          <DropdownMenuItem onClick={handleRestore}>
            <Undo className="mr-2 h-4 w-4" /> Restore
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleArchive}>
            <Archive className="mr-2 h-4 w-4" /> Archive
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setIsDeleteDialogOpen(true)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const statusBadge = website.deletedAt ? (
    <Badge
      variant="secondary"
      className="bg-destructive/10 text-destructive border-destructive/20 whitespace-nowrap"
    >
      Archived
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-background whitespace-nowrap">
      Draft
    </Badge>
  );

  const updatedText = (
    <span className="text-muted-foreground text-xs whitespace-nowrap">
      Updated {formatDistanceToNow(website.updatedAt, { addSuffix: true })}
    </span>
  );

  if (view === 'list') {
    return (
      <>
        <Card className="group hover:bg-muted/50 relative flex h-[72px] w-full flex-row items-center justify-between rounded-none border-2 border-[var(--ink)] p-4 shadow-[4px_4px_0px_var(--ink)] transition-colors">
          <CornerMarks />
          {isActionLoading && (
            <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
            </div>
          )}
          <div className="flex min-w-0 items-center gap-4">
            <div className="bg-muted/50 text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded border">
              <Globe className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <h3
                className="font-display max-w-[200px] truncate leading-none font-semibold tracking-tight sm:max-w-[300px]"
                title={website.name}
              >
                {website.name}
              </h3>
              <p
                className="mt-1 flex max-w-[200px] items-center gap-1 truncate text-sm sm:max-w-[300px]"
                style={{ color: 'var(--slate)' }}
              >
                {website.domain || website.description || 'No description'}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 pl-4 sm:gap-4">
            <div className="hidden items-center gap-4 sm:flex">
              {statusBadge}
              {updatedText}
            </div>
            {cardMenu}
          </div>
        </Card>

        <WebsiteSettingsModal
          website={website}
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your website and remove
                all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isActionLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] transition-transform hover:-translate-y-1">
        <CornerMarks />
        {isActionLoading && (
          <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        )}
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="min-w-0 pr-2">
            <h3
              className="font-display max-w-[180px] truncate leading-none font-semibold tracking-tight"
              title={website.name}
            >
              {website.name}
            </h3>
            <p
              className="mt-2 flex max-w-[180px] items-center gap-1 truncate text-sm"
              title={website.domain || website.description || ''}
              style={{ color: 'var(--slate)' }}
            >
              <Globe className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {website.domain || website.description || 'No domain set'}
              </span>
            </p>
          </div>
          <div className="-mt-2 -mr-2">{cardMenu}</div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 flex aspect-video w-full items-center justify-center rounded-none border border-[var(--line)]">
            <MonitorPlay className="h-10 w-10 opacity-30" style={{ color: 'var(--slate)' }} />
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 flex items-center justify-between border-t px-6 py-3">
          {statusBadge}
          {updatedText}
        </CardFooter>
      </Card>

      <WebsiteSettingsModal
        website={website}
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your website and remove all
              associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isActionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
