"use client";

import { useState } from "react";
import { BellRing, BriefcaseBusiness, KeyRound, Mail, ShieldCheck, User2 } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { appToast } from "@/lib/app-toast";

const quickStats = [
  { label: "Open assignments", value: "6", note: "Across frontend and triage flows." },
  { label: "Critical ownership", value: "2", note: "High-priority bugs currently under review." },
  { label: "Response SLA", value: "92%", note: "Average within current sprint." },
] as const;

const preferences = [
  { title: "Issue notifications", description: "Slack, email, and in-app alerts are enabled for assigned issues.", icon: BellRing },
  { title: "Security", description: "SSO active with backup email verification for critical workspace actions.", icon: ShieldCheck },
  { title: "Access scope", description: "Engineering Lead access across dashboard, kanban, teams, and settings.", icon: KeyRound },
] as const;

export function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "Raka Aditya",
    displayName: "Raka",
    email: "raka@bugtracker.app",
    role: "Engineering Lead",
    team: "Frontend",
    location: "Jakarta, Indonesia",
  });

  function handleSave() {
    appToast.success({
      title: "Profile updated",
      description: "Your profile details have been saved to the workspace view.",
    });
  }

  return (
    <AppShell
      activeNav="settings"
      title="Profile"
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Personal workspace profile</h2>
            <p className="text-sm text-muted-foreground">
              Manage your identity, role context, and personal preferences for the bug tracker workspace.
            </p>
          </div>
          <Button onClick={handleSave} variant="outline">Save changes</Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg">RA</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-semibold tracking-tight">Raka Aditya</h3>
                  <Badge variant="secondary">Engineering Lead</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Owner for triage coordination, issue review, and squad routing.</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="size-4" />
                    raka@bugtracker.app
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BriefcaseBusiness className="size-4" />
                    Frontend squad
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-[24rem]">
              {quickStats.map((item) => (
                <div key={item.label} className="rounded-xl border bg-muted/30 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Account details</CardTitle>
              <CardDescription>Basic identity information shown across issue ownership and team routing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input id="full-name" onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value }))} value={profile.fullName} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="display-name">Display name</Label>
                  <Input id="display-name" onChange={(event) => setProfile((current) => ({ ...current, displayName: event.target.value }))} value={profile.displayName} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} type="email" value={profile.email} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" onChange={(event) => setProfile((current) => ({ ...current, role: event.target.value }))} value={profile.role} />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="team">Primary squad</Label>
                  <Input id="team" onChange={(event) => setProfile((current) => ({ ...current, team: event.target.value }))} value={profile.team} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Work location</Label>
                  <Input id="location" onChange={(event) => setProfile((current) => ({ ...current, location: event.target.value }))} value={profile.location} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workspace preferences</CardTitle>
              <CardDescription>Quick summary of your active access and communication preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {preferences.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-xl border bg-muted/20 p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-background text-primary shadow-sm">
                        <Icon className="size-4" />
                      </span>
                      <div className="space-y-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile visibility</CardTitle>
            <CardDescription>Preview of how your identity appears in issue cards, assignments, and comments.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>RA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Issue assignee</p>
                  <p className="text-sm text-muted-foreground">Shown on kanban cards and issue detail panels.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <User2 className="size-4" />
                </span>
                <div>
                  <p className="font-medium">Team ownership</p>
                  <p className="text-sm text-muted-foreground">Used for PIC routing and team directory listings.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline">Engineering Lead</Badge>
                <div>
                  <p className="font-medium">Role badge</p>
                  <p className="text-sm text-muted-foreground">Visible in access-sensitive workspace sections.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
