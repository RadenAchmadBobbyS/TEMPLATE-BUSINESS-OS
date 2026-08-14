'use client';

import { useState, useEffect } from 'react';
import {
  getWorkspaceMembers,
  inviteMember,
  removeMember,
  updateMemberRole,
  getWorkspaceInvitations,
  revokeInvitation,
  resendInvitation,
} from '@/core/workspaces/actions';
import { useWorkspace } from '@/core/workspaces/components/WorkspaceProvider';
import { useToast } from '@/shared/hooks/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Loader2, Trash2, MailPlus, RefreshCw, XCircle } from 'lucide-react';
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

export function WorkspaceMembersTable() {
  const { activeWorkspace, role: currentUserRole } = useWorkspace();
  const { toast } = useToast();
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('EDITOR');
  const [inviteCanCreateDelete, setInviteCanCreateDelete] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Modal states
  const [removeUserId, setRemoveUserId] = useState<string | null>(null);
  const [revokeInviteId, setRevokeInviteId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    setFieldErrors({});
    if (!inviteEmail) return;
    setIsInviting(true);
    
    try {
      const result = await inviteMember({ 
        email: inviteEmail, 
        role: inviteRole, 
        canCreateDelete: inviteRole === 'EDITOR' ? inviteCanCreateDelete : false 
      });
      if (!result.success) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        } else {
          toast({ title: 'Failed to invite', description: result.error, variant: 'destructive' });
        }
        return;
      }
      
      toast({ title: 'Member invited successfully' });
      setIsInviteOpen(false);
      setInviteEmail('');
      fetchMembers();
    } catch (error: any) {
      toast({ title: 'Failed to invite', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string, canCreateDelete: boolean = false) => {
    try {
      const result = await updateMemberRole(userId, newRole as any, newRole === 'EDITOR' ? canCreateDelete : false);
      if (!result.success) {
        toast({ title: 'Failed to update role', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Role updated' });
      fetchMembers();
    } catch (error: any) {
      toast({ title: 'Failed to update role', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  const handleRemove = async () => {
    if (!removeUserId) return;
    setIsProcessing(true);
    try {
      const result = await removeMember(removeUserId);
      if (!result.success) {
        toast({ title: 'Failed to remove member', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Member removed' });
      fetchMembers();
    } catch (error: any) {
      toast({ title: 'Failed to remove member', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      setRemoveUserId(null);
    }
  };

  const handleRevokeInvite = async () => {
    if (!revokeInviteId) return;
    setIsProcessing(true);
    try {
      const result = await revokeInvitation(revokeInviteId);
      if (!result.success) {
        toast({ title: 'Failed to revoke', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Invitation revoked' });
      fetchMembers();
    } catch (error: any) {
      toast({ title: 'Failed to revoke', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      setRevokeInviteId(null);
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      const result = await resendInvitation(inviteId);
      if (!result.success) {
        toast({ title: 'Failed to resend', description: result.error, variant: 'destructive' });
        return;
      }
      toast({ title: 'Invitation resent successfully' });
    } catch (error: any) {
      toast({ title: 'Failed to resend', description: 'An unexpected error occurred.', variant: 'destructive' });
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
          <Dialog open={isInviteOpen} onOpenChange={(open) => {
            setIsInviteOpen(open);
            if (!open) {
              setInviteEmail('');
              setFieldErrors({});
            }
          }}>
            <DialogTrigger
              render={
                <Button size="sm" className="rounded-none border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all">
                  <MailPlus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              }
            />
            <DialogContent className="rounded-none border-2 border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-[var(--paper)]">
              <CornerMarks />
              <DialogHeader>
                <DialogTitle className="font-display">Invite a new member</DialogTitle>
                <DialogDescription style={{ color: "var(--slate)" }}>
                  Enter their email address and select a role. They must already have an account for this MVP.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider font-data">Email address</label>
                  <Input
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({});
                    }}
                    className={`rounded-none border-2 ${fieldErrors.email ? 'border-red-500' : 'border-[var(--ink)]'}`}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 font-medium mt-1">{fieldErrors.email[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider font-data">Role</label>
                  <Select value={inviteRole} onValueChange={(val: any) => setInviteRole(val)}>
                    <SelectTrigger className="rounded-none border-2 border-[var(--ink)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2 border-[var(--ink)] shadow-[4px_4px_0px_var(--ink)]">
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EDITOR">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {inviteRole === 'EDITOR' && (
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="canCreateDelete" 
                      checked={inviteCanCreateDelete}
                      onChange={(e) => setInviteCanCreateDelete(e.target.checked)}
                      className="rounded border-[var(--ink)] text-[var(--ink)] focus:ring-[var(--ink)]"
                    />
                    <label htmlFor="canCreateDelete" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Allow deleting & creating assets/websites
                    </label>
                  </div>
                )}
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
                      <div className="flex flex-col gap-2">
                        <Select
                          value={m.role}
                          onValueChange={(val: any) => handleRoleChange(m.user.id, val, m.canCreateDelete)}
                        >
                          <SelectTrigger className="h-8 w-[120px] text-xs rounded-none border-[var(--line)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-2 border-[var(--ink)] shadow-[2px_2px_0px_var(--ink)]">
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="EDITOR">Editor</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {m.role === 'EDITOR' && (
                           <div className="flex items-center space-x-1.5 mt-1">
                             <input 
                               type="checkbox" 
                               checked={m.canCreateDelete || false}
                               onChange={(e) => handleRoleChange(m.user.id, 'EDITOR', e.target.checked)}
                               className="h-3 w-3 rounded border-[var(--ink)] text-[var(--ink)] focus:ring-[var(--ink)]"
                               title="Allow deleting & creating assets/websites"
                             />
                             <span className="text-[10px] leading-none text-muted-foreground whitespace-nowrap">Can Create/Delete</span>
                           </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 items-start">
                        <Badge variant={m.role === 'OWNER' ? 'default' : 'secondary'} className="rounded-none border-0 text-[10px] font-bold uppercase tracking-wider font-data">{m.role}</Badge>
                        {m.role === 'EDITOR' && m.canCreateDelete && (
                           <span className="text-[10px] leading-none text-muted-foreground whitespace-nowrap">Can Create/Delete</span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isAdmin && m.role !== 'OWNER' && (
                      <Button variant="ghost" size="icon" className="rounded-none hover:bg-red-100" onClick={() => setRemoveUserId(m.user.id)}>
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
                    <div className="flex flex-col gap-1 items-start">
                      <Badge variant="outline" className="opacity-60">{inv.role}</Badge>
                      {inv.role === 'EDITOR' && inv.canCreateDelete && (
                        <span className="text-[10px] leading-none text-muted-foreground whitespace-nowrap opacity-60">Can Create/Delete</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {isAdmin && (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleResendInvite(inv.id)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                          Resend
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setRevokeInviteId(inv.id)} className="text-destructive hover:bg-red-50">
                          <XCircle className="mr-1.5 h-3.5 w-3.5" />
                          Revoke
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Confirmation Modals */}
      <AlertDialog open={!!removeUserId} onOpenChange={(open) => !open && setRemoveUserId(null)}>
        <AlertDialogContent className="rounded-none border-2 border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-[var(--paper)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Remove Member</AlertDialogTitle>
            <AlertDialogDescription style={{ color: "var(--slate)" }}>
              Are you sure you want to remove this member? They will lose access to the workspace immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} className="rounded-none border-2 border-[var(--ink)] hover:bg-[var(--line)]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); handleRemove(); }} disabled={isProcessing} className="rounded-none border-2 border-[var(--ink)] bg-red-600 hover:bg-red-700 text-white shadow-[2px_2px_0px_var(--ink)]">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!revokeInviteId} onOpenChange={(open) => !open && setRevokeInviteId(null)}>
        <AlertDialogContent className="rounded-none border-2 border-[var(--ink)] shadow-[8px_8px_0px_var(--ink)] bg-[var(--paper)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Revoke Invitation</AlertDialogTitle>
            <AlertDialogDescription style={{ color: "var(--slate)" }}>
              Are you sure you want to revoke this invitation? The recipient will no longer be able to accept it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing} className="rounded-none border-2 border-[var(--ink)] hover:bg-[var(--line)]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); handleRevokeInvite(); }} disabled={isProcessing} className="rounded-none border-2 border-[var(--ink)] bg-red-600 hover:bg-red-700 text-white shadow-[2px_2px_0px_var(--ink)]">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Revoke Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </Card>
  );
}
