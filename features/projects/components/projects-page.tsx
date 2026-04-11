"use client";

import { FolderKanban, ShieldAlert, Target } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  projectMetrics,
  projectOptions,
  projectStatusVariant,
} from "@/features/bug-tracker/data/bug-tracker-data";

const projectHighlights = [
  {
    label: "Tracked projects",
    value: String(projectOptions.length),
    icon: FolderKanban,
    note: "All active delivery streams mapped to bug tracker routing.",
  },
  {
    label: "Critical projects",
    value: String(projectMetrics.filter((project) => project.criticalIssues > 0).length),
    icon: ShieldAlert,
    note: "Projects with active critical issues need close monitoring.",
  },
  {
    label: "Upcoming milestones",
    value: "4",
    icon: Target,
    note: "Every project has a next milestone tied to issue burn-down.",
  },
] as const;

export function ProjectsPage() {
  return (
    <AppShell
      activeNav="projects"
      eyebrow="Project routing"
      title="Projects"
      toolbar={
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold tracking-tight">Project health and ownership</h2>
          <p className="text-sm text-muted-foreground">
            Kelola daftar project, owner, milestone, dan issue pressure per product area.
          </p>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {projectHighlights.map((item) => {
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

        <Card>
          <CardHeader>
            <CardTitle>Project portfolio</CardTitle>
            <CardDescription>
              Daftar project aktif dengan status, owner, milestone, dan tekanan issue saat ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Open issues</TableHead>
                  <TableHead>Critical</TableHead>
                  <TableHead>Next milestone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectMetrics.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.team}</TableCell>
                    <TableCell>{project.owner}</TableCell>
                    <TableCell>
                      <Badge variant={projectStatusVariant(project.status)}>{project.status}</Badge>
                    </TableCell>
                    <TableCell>{project.openIssues}</TableCell>
                    <TableCell>
                      <Badge variant={project.criticalIssues > 0 ? "destructive" : "secondary"}>
                        {project.criticalIssues}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.nextMilestone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {projectMetrics.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      Owned by {project.owner} · {project.team}
                    </CardDescription>
                  </div>
                  <Badge variant={projectStatusVariant(project.status)}>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Open issues</p>
                    <p className="mt-1 text-2xl font-semibold">{project.openIssues}</p>
                  </div>
                  <div className="rounded-xl bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Critical</p>
                    <p className="mt-1 text-2xl font-semibold">{project.criticalIssues}</p>
                  </div>
                  <div className="rounded-xl bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Next target</p>
                    <p className="mt-1 text-sm font-medium">{project.nextMilestone}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Project ini dipakai sebagai opsi di form create issue, jadi tim bisa langsung route bug ke product area yang tepat.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
