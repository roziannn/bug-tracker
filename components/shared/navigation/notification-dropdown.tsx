"use client";

import Link from "next/link";
import { Bell, CheckCheck, CircleDot, GitPullRequest, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const notifications = [
  {
    id: "notif-1",
    title: "BUG-218 moved to In review",
    description: "QA is validating the crash fix for large screenshot uploads.",
    time: "2m ago",
    icon: GitPullRequest,
    tone: "secondary" as const,
  },
  {
    id: "notif-2",
    title: "Critical triage alert",
    description: "A new payment failure bug needs an owner before the next standup.",
    time: "10m ago",
    icon: ShieldAlert,
    tone: "destructive" as const,
  },
  {
    id: "notif-3",
    title: "BUG-209 marked Ready",
    description: "Frontend team attached clear repro steps and acceptance notes.",
    time: "26m ago",
    icon: CircleDot,
    tone: "outline" as const,
  },
];

export function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button aria-label="Notifications" className="relative" size="icon" variant="outline" />
        }
      >
        <Bell />
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
          {notifications.length}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[22rem] p-0">
        <DropdownMenuGroup>
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">
                Notifications
              </DropdownMenuLabel>
              <p className="text-xs text-muted-foreground">
                Latest updates from triage and review flow.
              </p>
            </div>
            <Button size="sm" variant="ghost">
              <CheckCheck />
              Mark all
            </Button>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className="max-h-96 overflow-y-auto p-1">
          {notifications.map((notification) => {
            const Icon = notification.icon;

            return (
              <DropdownMenuItem
                key={notification.id}
                className="items-start gap-3 rounded-xl p-3"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">
                      {notification.title}
                    </p>
                    <Badge variant={notification.tone}>{notification.time}</Badge>
                  </div>
                  <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <DropdownMenuItem
            className="justify-center rounded-xl py-2 font-medium text-primary"
            render={<Link href="/kanban" />}
          >
            View all activity
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
