"use client";

import Link from "next/link";
import { Building2, Settings2, ShieldAlert, UserPlus, Users } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { issues, picOptions, priorityVariant, teamMetrics } from "@/features/bug-tracker/data/bug-tracker-data";

const teamHighlights = [
  { label: "Active squads", value: "3", icon: Building2, note: "Frontend, Platform, and Core are currently on call." },
  { label: "Assigned PICs", value: String(picOptions.length), icon: Users, note: "Engineers available for direct issue routing." },
  { label: "Critical owners", value: "2", icon: ShieldAlert, note: "Two squads are handling critical tickets this week." },
] as const;

export function TeamsPage() {
  return (
    <AppShell
      activeNav="teams"
      eyebrow="People & ownership"
      title="Teams"
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Team workload overview</h2>
            <p className="text-sm text-muted-foreground">
              Lihat ownership squad, jumlah issue aktif, dan maintenance group team langsung dari workspace.
            </p>
          </div>

          <Button
            nativeButton={false}
            render={
              <Link href="/teams/groups">
                <Settings2 />
                Manage group teams
              </Link>
            }
            size="lg"
          />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {teamHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.label}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardDescription>{item.label}</CardDescription>
                      <CardTitle className="mt-2 text-3xl">{item.value}</CardTitle>
                    </div>
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.note}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Team capacity</CardTitle>
              <CardDescription>
                Ringkasan squad, lead, SLA, issue aktif, dan akses cepat untuk tambah member ke team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Open issues</TableHead>
                    <TableHead>Critical</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMetrics.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>{team.lead}</TableCell>
                      <TableCell>{team.members}</TableCell>
                      <TableCell>{team.activeIssues}</TableCell>
                      <TableCell>
                        <Badge variant={team.criticalOpen > 0 ? "destructive" : "secondary"}>
                          {team.criticalOpen}
                        </Badge>
                      </TableCell>
                      <TableCell>{team.sla}</TableCell>
                      <TableCell>
                        <Button
                          nativeButton={false}
                          render={<Link href={`/teams/${team.id}/members`} />}
                          size="sm"
                          variant="outline"
                        >
                          <UserPlus />
                          Add member
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PIC directory</CardTitle>
              <CardDescription>
                Kandidat owner awal issue berdasarkan squad dan distribusi task yang ada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {picOptions.map((person) => {
                const openOwnedIssues = issues.filter((issue) => issue.assignee.toLowerCase() === person.value).length;

                return (
                  <div key={person.value} className="flex items-center justify-between gap-3 rounded-xl border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {person.label
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{person.label}</p>
                        <p className="text-sm text-muted-foreground">{person.team}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{openOwnedIssues} issues</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Squad issue focus</CardTitle>
            <CardDescription>
              Snapshot issue aktif per team untuk bantu routing saat triage cepat.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {teamMetrics.map((team) => {
              const teamIssues = issues.filter((issue) => issue.team === team.name);

              return (
                <div key={team.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{team.name}</p>
                      <p className="text-sm text-muted-foreground">{teamIssues.length} tracked issues</p>
                    </div>
                    <AvatarGroup>
                      {picOptions
                        .filter((person) => person.team === team.name)
                        .slice(0, 3)
                        .map((person) => (
                          <Avatar key={person.value} size="sm">
                            <AvatarFallback>
                              {person.label
                                .split(" ")
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                    </AvatarGroup>
                  </div>

                  <div className="mt-4 space-y-3">
                    {teamIssues.slice(0, 3).map((issue) => (
                      <div key={issue.id} className="rounded-lg bg-muted/30 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{issue.id}</p>
                          <Badge variant={priorityVariant(issue.priority)}>{issue.priority}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{issue.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
