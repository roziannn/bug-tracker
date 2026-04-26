"use client";

import Link from "next/link";
import { Settings2, UserPlus } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { issues, picOptions, priorityVariant, teamMetrics } from "@/features/bug-tracker/data/bug-tracker-data";

const picDirectoryByTeam = teamMetrics.map((team) => ({
  team: team.name,
  members: picOptions.filter((person) => person.team === team.name),
}));

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
            <p className="text-sm text-muted-foreground">Lihat ownership squad, jumlah issue aktif, dan maintenance group team langsung dari workspace.</p>
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
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Team capacity</CardTitle>
              <CardDescription>Ringkasan squad, lead, SLA, issue aktif, dan akses cepat untuk tambah member ke team.</CardDescription>
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
                        <Badge variant={team.criticalOpen > 0 ? "destructive" : "secondary"}>{team.criticalOpen}</Badge>
                      </TableCell>
                      <TableCell>{team.sla}</TableCell>
                      <TableCell>
                        <Button nativeButton={false} render={<Link href={`/teams/${team.id}/members`} />} size="sm" variant="outline">
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
              <CardDescription>Kandidat owner awal issue berdasarkan squad dan distribusi task yang ada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {picDirectoryByTeam.map((group) => {
                return (
                  <div key={group.team} className="grid gap-2 rounded-xl border px-3 py-3 md:grid-cols-[88px_minmax(0,1fr)] md:items-start">
                    <div className="pt-0.5">
                      <p className="text-sm font-semibold">{group.team}</p>
                    </div>

                    <div className="text-sm leading-6 text-muted-foreground">
                      {group.members.map((person, index) => (
                        <span key={person.value}>
                          <span className="font-medium text-foreground">{person.label}</span>
                          {index < group.members.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Squad issue focus</CardTitle>
            <CardDescription>Snapshot issue aktif per team untuk bantu routing saat triage cepat.</CardDescription>
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
