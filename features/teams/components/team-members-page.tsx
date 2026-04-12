"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTeamById, picOptions } from "@/features/bug-tracker/data/bug-tracker-data";

export function TeamMembersPage({ id }: { id: string }) {
  const team = getTeamById(id);

  if (!team) {
    return (
      <AppShell activeNav="teams" eyebrow="People & ownership" title="Team not found">
        <Card>
          <CardHeader>
            <CardTitle>Team not found</CardTitle>
            <CardDescription>Team dengan id `{id}` belum tersedia di data bug tracker saat ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} render={<Link href="/teams" />} variant="outline">
              Back to teams
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const members = picOptions.filter((person) => person.team === team.name);

  return (
    <AppShell
      activeNav="teams"
      eyebrow="People & ownership"
      title={`Add Members - ${team.name}`}
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Add people to team</h2>
            <p className="text-sm text-muted-foreground">Penambahan orang dipisah dari maintenance group team supaya role dan membership lebih rapi.</p>
          </div>
          <Button nativeButton={false} render={<Link href="/teams/groups" />} variant="outline">
            Manage group teams
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Add member</CardTitle>
            <CardDescription>Tambahkan anggota baru ke team `{team.name}` tanpa mengubah struktur group team lainnya.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="member-name">Full name</Label>
              <Input id="member-name" placeholder="Contoh: Nabila Putri" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-role">Role</Label>
              <Input id="member-role" placeholder="Contoh: Frontend Engineer" />
            </div>
            <div className="grid gap-2">
              <Label>Access level</Label>
              <Select defaultValue="member">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="observer">Observer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <UserPlus />
              Add to {team.name}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current members</CardTitle>
            <CardDescription>Daftar member yang saat ini terhubung ke team {team.name}.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {members.map((member) => (
              <div key={member.value} className="flex items-center justify-between gap-3 rounded-xl border p-4">
                <div>
                  <p className="font-medium">{member.label}</p>
                  <p className="text-sm text-muted-foreground">{member.team}</p>
                </div>
                <Badge variant="outline">PIC</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
