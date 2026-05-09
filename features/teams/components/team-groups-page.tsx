"use client";

import Link from "next/link";
import { Edit2, Plus, Save, Users } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { teamMetrics } from "@/features/bug-tracker/data/bug-tracker-data";

const domainOptions = ["engineering", "platform", "operations"] as const;

type GroupTeamRecord = {
  id: string;
  name: string;
  lead: string;
  domain: (typeof domainOptions)[number];
  members: number;
  sla: string;
  activeIssues: number;
  isActive: "active" | "inactive";
};

export function TeamGroupsPage() {
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupLead, setGroupLead] = useState("");
  const [domain, setDomain] = useState<(typeof domainOptions)[number]>("engineering");
  const [isActive, setIsActive] = useState<"active" | "inactive">("active");
  const [groups, setGroups] = useState<GroupTeamRecord[]>(() =>
    teamMetrics.map((team, index) => ({
      id: team.id,
      name: team.name,
      lead: team.lead,
      domain: index % 3 === 0 ? "engineering" : index % 3 === 1 ? "platform" : "operations",
      members: team.members,
      sla: team.sla,
      activeIssues: team.activeIssues,
      isActive: "active",
    }))
  );

  const isEditing = editingGroupId !== null;

  function resetForm() {
    setEditingGroupId(null);
    setGroupName("");
    setGroupLead("");
    setDomain("engineering");
    setIsActive("active");
  }

  function handleSubmit() {
    if (!groupName.trim() || !groupLead.trim()) {
      return;
    }

    if (isEditing) {
      setGroups((current) =>
        current.map((group) =>
          group.id === editingGroupId
            ? {
                ...group,
                name: groupName.trim(),
                lead: groupLead.trim(),
                domain,
                isActive,
              }
            : group
        )
      );
      resetForm();
      return;
    }

    setGroups((current) => [
      ...current,
      {
        id: `${groupName.toLowerCase().replaceAll(/\s+/g, "-")}-${current.length + 1}`,
        name: groupName.trim(),
        lead: groupLead.trim(),
        domain,
        members: 0,
        sla: "TBD",
        activeIssues: 0,
        isActive: "active",
      },
    ]);
    resetForm();
  }

  function handleEdit(group: GroupTeamRecord) {
    setEditingGroupId(group.id);
    setGroupName(group.name);
    setGroupLead(group.lead);
    setDomain(group.domain);
    setIsActive(group.isActive);
  }

  return (
    <AppShell
      activeNav="teams"
      breadcrumbs={[
        { label: "Teams", href: "/teams" },
        { label: "Manage Group Teams" },
      ]}
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
            <CardTitle>{isEditing ? "Edit group team" : "Create group team"}</CardTitle>
            <CardDescription>
              {isEditing
                ? "Update group team untuk struktur squad atau domain ownership yang berbeda."
                : "Tambahkan group team baru untuk struktur squad atau domain ownership yang berbeda."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">Group name</Label>
              <Input id="team-name" value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="Contoh: Mobile Platform" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-lead">Lead</Label>
              <Input id="team-lead" value={groupLead} onChange={(event) => setGroupLead(event.target.value)} placeholder="Contoh: Andi Pratama" />
            </div>
            <div className="grid gap-2">
              <Label>Domain</Label>
              <Select value={domain} onValueChange={(value) => setDomain(value as (typeof domainOptions)[number])}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "engineering" ? "Engineering" : option === "platform" ? "Platform" : "Operations"}
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
                {isEditing ? <Save /> : <Plus />}
                {isEditing ? "Save group" : "Create group"}
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
            <CardTitle>Existing group teams</CardTitle>
            <CardDescription>
              Maintenance terpisah untuk group team, sedangkan penambahan orang dilakukan dari halaman team masing-masing.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {groups.map((team) => (
              <div key={team.id} className="rounded-xl border p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{team.name}</p>
                      <Badge variant="outline">{team.members} members</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Lead: {team.lead} · Domain: {team.domain} · SLA: {team.sla} · Open issues: {team.activeIssues}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => handleEdit(team)} variant="outline" size="sm">
                      <Edit2 />
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
