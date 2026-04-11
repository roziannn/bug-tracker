"use client";

import Link from "next/link";
import { Plus, Settings2, Users } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { teamMetrics } from "@/features/bug-tracker/data/bug-tracker-data";

export function TeamGroupsPage() {
  return (
    <AppShell
      activeNav="teams"
      eyebrow="People & ownership"
      title="Manage Group Teams"
      toolbar={
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Group team maintenance</h2>
          <p className="text-sm text-muted-foreground">
            Buat, atur, dan review group team yang dipakai untuk ownership dan routing issue.
          </p>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Create group team</CardTitle>
            <CardDescription>
              Tambahkan group team baru untuk struktur squad atau domain ownership yang berbeda.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">Group name</Label>
              <Input id="team-name" placeholder="Contoh: Mobile Platform" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-lead">Lead</Label>
              <Input id="team-lead" placeholder="Contoh: Andi Pratama" />
            </div>
            <div className="grid gap-2">
              <Label>Domain</Label>
              <Select defaultValue="engineering">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="platform">Platform</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus />
              Create group
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing group teams</CardTitle>
            <CardDescription>
              Maintenance terpisah untuk group team, sedangkan penambahan orang dilakukan dari halaman team masing-masing.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {teamMetrics.map((team) => (
              <div key={team.id} className="rounded-xl border p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{team.name}</p>
                      <Badge variant="outline">{team.members} members</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Lead: {team.lead} · SLA: {team.sla} · Open issues: {team.activeIssues}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline">
                      <Settings2 />
                      Edit group
                    </Button>
                    <Button
                      nativeButton={false}
                      render={<Link href={`/teams/${team.id}/members`} />}
                    >
                      <Users />
                      Add people
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
