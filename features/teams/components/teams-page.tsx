"use client";

import Link from "next/link";
import { useState } from "react";
import { Settings2, UserPlus, Layout, Server, Cpu, Layers } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { issues, priorityVariant, teamMetrics } from "@/features/bug-tracker/data/bug-tracker-data";

const PAGE_SIZE = 5;

export function TeamsPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(teamMetrics.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedTeams = teamMetrics.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
        <Card>
          <CardHeader>
            <CardTitle>Team capacity</CardTitle>
            <CardDescription>Ringkasan squad, lead, SLA, distribusi tingkat keparahan issue, dan total beban kerja.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
           
                <Table className="min-w-[1100px]">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b">
                      <TableHead>Team</TableHead>
                      <TableHead>Lead</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Total Issues</TableHead>
                      <TableHead>High</TableHead>
                      <TableHead>Critical</TableHead>
                      <TableHead>SLA</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTeams.map((team, index) => {
                      const teamIssues = issues.filter((i) => i.team === team.name);
                      const highIssues = teamIssues.filter((i) => i.priority === "High").length;
                      const isLast = index === paginatedTeams.length - 1;
                      return (
                        <TableRow 
                          key={team.id} 
                          className={isLast ? "border-0" : "border-b"}
                        >
                          <TableCell className="font-semibold">{team.name}</TableCell>
                          <TableCell>{team.lead}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-muted/50 font-normal text-sm border-none">
                              {team.domain}
                            </Badge>
                          </TableCell>
                          <TableCell>{team.members} members</TableCell>
                          <TableCell>
                            <span className="font-mono">{teamIssues.length}</span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={highIssues > 0 ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-none" : "border-none"}
                            >
                              {highIssues}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={team.criticalOpen > 0 ? "destructive" : "secondary"} className="border-none">
                              {team.criticalOpen}
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-medium text-emerald-600 dark:text-emerald-400">
                            {team.sla}
                          </TableCell>
                          <TableCell>
                            <Button nativeButton={false} render={<Link href={`/teams/${team.id}/members`} />} size="sm" variant="outline">
                              <UserPlus className="mr-2 size-4" />
                              Add member
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedTeams.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(currentPage * PAGE_SIZE, teamMetrics.length)} of {teamMetrics.length} teams
              </p>
              <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Squad issue focus</CardTitle>
            <CardDescription>Snapshot issue aktif per team untuk bantu routing saat triage cepat.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {teamMetrics.map((team) => {
              const teamIssues = issues.filter((issue) => issue.team === team.name);
              return (
                <div key={team.id} className="rounded-xl border p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {team.name === "Frontend" && <Layout className="size-5" />}
                      {team.name === "Platform" && <Server className="size-5" />}
                      {team.name === "Core" && <Cpu className="size-5" />}
                      {!["Frontend", "Platform", "Core"].includes(team.name) && <Layers className="size-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold leading-none">{team.name}</p>
                      <p className="mt-1.5 text-xs text-muted-foreground whitespace-nowrap">
                        {teamIssues.length} tracked issues
                      </p>
                    </div>
                  </div>
                </div>
                  <div className="mt-4 space-y-3">
                    {teamIssues.length > 0 ? (
                      teamIssues.slice(0, 3).map((issue) => (
                        <div key={issue.id} className="rounded-lg bg-muted/30 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-mono font-medium">{issue.id}</p>
                            <Badge variant={priorityVariant(issue.priority)} className="scale-75 origin-right">{issue.priority}</Badge>
                          </div>
                          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{issue.title}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-[180px] items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                        No active issues
                      </div>
                    )}
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