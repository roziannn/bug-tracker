"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pencil, Save, UserPlus } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTeamById, picOptions } from "@/features/bug-tracker/data/bug-tracker-data";

const PAGE_SIZE = 4;
const roleOptions = ["Admin", "Lead", "Engineer", "QA"] as const;
const accessLevelOptions = ["member", "lead", "observer"] as const;

type TeamMemberRecord = {
  id: string;
  name: string;
  email: string;
  team: string;
  role: (typeof roleOptions)[number];
  accessLevel: (typeof accessLevelOptions)[number];
  isActive: "active" | "inactive";
};

export function TeamMembersPage({ id }: { id: string }) {
  const team = getTeamById(id);
  const initialTeamName = team?.name ?? "";
  const [page, setPage] = useState(1);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<(typeof roleOptions)[number]>("Engineer");
  const [accessLevel, setAccessLevel] = useState<(typeof accessLevelOptions)[number]>("member");
  const [isActive, setIsActive] = useState<"active" | "inactive">("active");
  const [members, setMembers] = useState<TeamMemberRecord[]>(() =>
    picOptions
      .filter((person) => person.team === initialTeamName)
      .map((person, index) => ({
        id: person.value,
        name: person.label,
        email: `${person.label.toLowerCase().replaceAll(" ", ".")}@company.com`,
        team: person.team,
        role: index === 0 ? "Lead" : "Engineer",
        accessLevel: index === 0 ? "lead" : "member",
        isActive: "active",
      })),
  );

  if (!team) {
    return (
      <AppShell
        activeNav="teams"
        breadcrumbs={[
          { label: "Teams", href: "/teams" },
          { label: "Team not found" },
        ]}
        eyebrow="People & ownership"
        title="Team not found"
      >
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

  const teamName = team.name;

  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedMembers = members.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const isEditing = editingMemberId !== null;

  function resetForm() {
    setEditingMemberId(null);
    setMemberName("");
    setMemberEmail("");
    setMemberRole("Engineer");
    setAccessLevel("member");
    setIsActive("active");
  }

  function handleSubmit() {
    if (!memberName.trim() || !memberEmail.trim()) {
      return;
    }

    if (isEditing) {
      setMembers((current) =>
        current.map((member) =>
          member.id === editingMemberId
            ? {
                ...member,
                name: memberName.trim(),
                email: memberEmail.trim(),
                role: memberRole,
                accessLevel,
                isActive,
              }
            : member,
        ),
      );
      resetForm();
      return;
    }

    setMembers((current) => [
      ...current,
      {
        id: `${memberName.toLowerCase().replaceAll(/\s+/g, "-")}-${current.length + 1}`,
        name: memberName.trim(),
        email: memberEmail.trim(),
        team: teamName,
        role: memberRole,
        accessLevel,
        isActive: "active",
      },
    ]);
    resetForm();
  }

  function handleEdit(member: TeamMemberRecord) {
    setEditingMemberId(member.id);
    setMemberName(member.name);
    setMemberEmail(member.email);
    setMemberRole(member.role);
    setAccessLevel(member.accessLevel);
    setIsActive(member.isActive);
  }

  return (
    <AppShell
      activeNav="teams"
      breadcrumbs={[
        { label: "Teams", href: "/teams" },
        { label: teamName },
        { label: "Add Members" },
      ]}
      eyebrow="People & ownership"
      title={`Add Members - ${teamName}`}
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
            <CardTitle>{isEditing ? "Edit member" : "Add member"}</CardTitle>
            <CardDescription>
              {isEditing ? `Update data anggota team \`${teamName}\` tanpa mengubah struktur group team lainnya.` : `Tambahkan anggota baru ke team \`${teamName}\` tanpa mengubah struktur group team lainnya.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="member-name">Full name</Label>
              <Input id="member-name" value={memberName} onChange={(event) => setMemberName(event.target.value)} placeholder="Contoh: Nabila Putri" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-email">Email</Label>
              <Input id="member-email" type="email" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} placeholder="Contoh: nabila@company.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-role">Role</Label>
              <Select value={memberRole} onValueChange={(value) => setMemberRole(value as (typeof roleOptions)[number])}>
                <SelectTrigger className="w-full" id="member-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Access level</Label>
              <Select value={accessLevel} onValueChange={(value) => setAccessLevel(value as (typeof accessLevelOptions)[number])}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accessLevelOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "member" ? "Member" : option === "lead" ? "Lead" : "Observer"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isEditing ? (
              <div className="grid gap-2">
                <Label>Is active</Label>
                <Select value={isActive} onValueChange={(value) => setIsActive(value as "active" | "inactive")}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>
                {isEditing ? <Save /> : <UserPlus />}
                {isEditing ? "Save member" : `Add to ${teamName}`}
              </Button>
              {isEditing ? (
                <Button onClick={resetForm} variant="outline">
                  Cancel
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current members</CardTitle>
            <CardDescription>Daftar member yang saat ini terhubung ke team {teamName}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.length ? (
                  paginatedMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell className="text-muted-foreground">{member.team}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEdit(member)} variant="outline" size="icon-sm">
                          <Pencil />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                      No members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedMembers.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(currentPage * PAGE_SIZE, members.length)} of {members.length} members
              </p>
              <div className="flex items-center gap-2">
                <Button disabled={currentPage === 1} onClick={() => setPage(1)} variant="outline" size="sm">
                  <ChevronsLeft />
                </Button>
                <Button disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} variant="outline" size="sm">
                  <ChevronLeft />
                </Button>
                <Badge variant="outline">{currentPage}</Badge>
                <Button disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} variant="outline" size="sm">
                  <ChevronRight />
                </Button>
                <Button disabled={currentPage === totalPages} onClick={() => setPage(totalPages)} variant="outline" size="sm">
                  <ChevronsRight />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
