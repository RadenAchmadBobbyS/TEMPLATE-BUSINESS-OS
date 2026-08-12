'use client';

import { useState, useEffect } from 'react';
import {
  getWorkspaceMembers,
  inviteMember,
  removeMember,
  updateMemberRole,
  getWorkspaceInvitations,
  revokeInvitation,
} from '@/core/workspaces/actions';
import { useWorkspace } from '@/core/workspaces/components/WorkspaceProvider';
import { useToast } from '@/shared/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Loader2, Trash2, MailPlus } from 'lucide-react';
import { CornerMarks } from '@/shared/ui/blueprint';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

export function WorkspaceMembersTable() {
  const { activeWorkspace, role: currentUserRole } = useWorkspace();
  const { toast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('VIEWER');
  const [isInviting, setIsInviting] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const isAdmin = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  const fetchMembers = async () => {
    try {
      const [membersData, invitesData] = await Promise.all([
        getWorkspaceMembers(),
        isAdmin ? getWorkspaceInvitations() : Promise.resolve([])
      ]);
      setMembers(membersData);
      setInvitations(invitesData);
    } catch (e: any) {
      toast({ title: 'Failed to load members', description: e.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [activeWorkspace?.id]);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setIsInviting(true);
    try {
      await inviteMember({ email: inviteEmail, role: inviteRole });
      toast({ title: 'Member invited successfully' });
      setIsInviteOpen(false);
      setInviteEmail('');
      fetchMembers();
    } catch (error: any) {
      toast({ title: 'Failed to invite', description: error.message, variant: 'destructive' });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateMemberRole(userId, newRole as any);
      toast({ title: 'Role updated' });
      fetchMembers();
    } catch (error: any) {
      toast({ title: 'Failed to update role', description: error.message, variant: 'destructive' });
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await removeMember(userId);
      toast({ title: 'Member removed' });
      fetchMembers();
    } catch (error: any) {
      toast({
        title: 'Failed to remove member',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    if (!confirm('Are you sure you want to revoke this invitation?')) return;
    try {
      await revokeInvitation(inviteId);
      toast({ title: 'Invitation revoked' });
      fetchMembers();
    } catch (error: any) {
      toast({ title: 'Failed to revoke', description: error.message, variant: 'destructive' });
    }
  };

  if (!activeWorkspace) return null;

  return (
    <Card className="rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)] bg-[var(--paper)] relative">
      <CornerMarks />
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-display">Members</CardTitle>
          <CardDescription style={{ color: "var(--slate)" }}>Manage who has access to this workspace.</CardDescription>
        </div>

        {isAdmin && (
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger>
              <Button size="sm" className="rounded-none border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                <MailPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-none border-2 border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-[var(--paper)]">
              <CornerMarks />
              <DialogHeader>
                <DialogTitle className="font-display">Invite a new member</DialogTitle>
                <DialogDescription style={{ color: "var(--slate)" }}>
                  Enter their email address and select a role. They must already have an account for
                  this MVP.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider font-data">Email address</label>
                  <Input
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="rounded-none border-2 border-[var(--ink)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider font-data">Role</label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="rounded-none border-2 border-[var(--ink)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)]">
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EDITOR">Editor</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteOpen(false)} className="rounded-none border-2 border-[var(--ink)] hover:bg-[var(--line)]">
                  Cancel
                </Button>
                <Button onClick={handleInvite} disabled={isInviting || !inviteEmail} className="rounded-none border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                  {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Invite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={m.user.image} />
                        <AvatarFallback>{m.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{m.user.name}</div>
                        <div className="text-muted-foreground text-xs">{m.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isAdmin && m.role !== 'OWNER' ? (
                      <Select
                        value={m.role}
                        onValueChange={(val: string) => handleRoleChange(m.user.id, val)}
                      >
                        <SelectTrigger className="h-8 w-[120px] text-xs rounded-none border-[var(--line)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)]">
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="EDITOR">Editor</SelectItem>
                          <SelectItem value="VIEWER">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={m.role === 'OWNER' ? 'default' : 'secondary'} className="rounded-none border-0 text-[10px] font-bold uppercase tracking-wider font-data">{m.role}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isAdmin && m.role !== 'OWNER' && (
                      <Button variant="ghost" size="icon" className="rounded-none hover:bg-red-100" onClick={() => handleRemove(m.user.id)}>
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              
              {invitations.map((inv) => (
                <TableRow key={inv.id} className="bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3 opacity-60">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium italic">Pending Invite</div>
                        <div className="text-muted-foreground text-xs">{inv.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="opacity-60">{inv.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {isAdmin && (
                      <Button variant="ghost" size="sm" onClick={() => handleRevokeInvite(inv.id)} className="text-destructive">
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
