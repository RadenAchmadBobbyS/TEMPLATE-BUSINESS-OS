"use client";

import { Bell, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { Badge } from "@/shared/ui/badge";
import { useEffect, useState } from "react";
import { getMyNotifications, markNotificationAsRead } from "@/core/notifications/actions";
import { getPendingInvitations } from "@/core/workspaces/actions";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import type { WorkspaceInvitation, Notification, Workspace } from "@prisma/client";

export function NotificationNav() {
  const [invitations, setInvitations] = useState<(WorkspaceInvitation & { workspace: Workspace })[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getPendingInvitations().then(setInvitations).catch(console.error);
    getMyNotifications().then(setNotifications).catch(console.error);
  }, []);
  
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const unreadCount = invitations.length + unreadNotifications.length;

  const handleRead = async (id: string, url: string | null) => {
    try {
      const res = await markNotificationAsRead(id);
      if (res && 'success' in res && !res.success) throw new Error(res.error);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await Promise.all(unreadNotifications.map(async n => {
        const res = await markNotificationAsRead(n.id);
        if (res && 'success' in res && !res.success) throw new Error(res.error);
      }));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Popover>
      <PopoverTrigger render={
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      } />
      <PopoverContent align="end" className="w-80 max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-between font-semibold border-b pb-2 mb-2">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span 
              onClick={handleMarkAllRead}
              className="text-xs text-muted-foreground font-normal cursor-pointer hover:underline"
            >
              Mark all as read
            </span>
          )}
        </div>
        <div className="space-y-4">
          {unreadCount === 0 && notifications.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">No notifications</div>
          ) : (
            <>
              {/* Workspace Invitations */}
              {invitations.map((inv) => (
                <div key={inv.id} className="flex items-start gap-4 text-sm bg-muted/30 p-2 rounded-md">
                  <div className={`mt-1 h-2 w-2 rounded-full bg-primary`} />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium leading-none">
                      Invited to {inv.workspace.name}
                    </p>
                    <Link href="/dashboard/invitations" className="text-xs text-primary hover:underline mt-1 block">
                      Review Invitation
                    </Link>
                  </div>
                </div>
              ))}

              {/* General Notifications */}
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`flex items-start gap-4 text-sm p-2 rounded-md cursor-pointer transition-colors hover:bg-muted/50 ${!n.isRead ? 'bg-muted/20' : ''}`}
                  onClick={() => handleRead(n.id, n.actionUrl)}
                >
                  <div className={`mt-1 h-2 w-2 rounded-full ${!n.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <p className={`font-medium leading-none ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {n.message}
                    </p>
                    {n.actionUrl && (
                      <span className="text-xs text-primary hover:underline mt-1 block">
                        View details
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
