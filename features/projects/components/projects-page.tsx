"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FolderKanban, Plus, ShieldAlert, Target } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  projectMetrics,
  projectOptions,
  projectStatusVariant,
} from "@/features/bug-tracker/data/bug-tracker-data";

const PAGE_SIZE = 4;

function truncateProjectDescription(value: string, maxLength = 30) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

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
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(projectMetrics.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProjects = useMemo(
    () =>
      projectMetrics.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [currentPage]
  );

  return (
    <AppShell
      activeNav="projects"
      eyebrow="Project routing"
      title="Projects"
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Project health and ownership</h2>
            <p className="text-sm text-muted-foreground">
              Kelola daftar project, owner, milestone, dan issue pressure per product area.
            </p>
          </div>

          <Button
            nativeButton={false}
            render={
              <Link href="/projects/create">
                <Plus />
                Create project
              </Link>
            }
            size="lg"
          />
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
                <CardFooter className="justify-between">
                  <Badge variant="secondary">Portfolio</Badge>
                  <span className="text-xs text-muted-foreground">{item.note}</span>
                </CardFooter>
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
          <CardContent className="space-y-4">
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
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.length ? (
                  paginatedProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="align-top">
                        <div className="max-w-xl space-y-1">
                          <p className="font-medium">{project.name}</p>
                          <p className="max-w-xl text-sm text-muted-foreground">
                            {truncateProjectDescription(project.description)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-28 align-top">{project.team}</TableCell>
                      <TableCell className="min-w-36 align-top">{project.owner}</TableCell>
                      <TableCell className="min-w-28 align-top">
                        <Badge variant={projectStatusVariant(project.status)}>{project.status}</Badge>
                      </TableCell>
                      <TableCell className="align-top">{project.openIssues}</TableCell>
                      <TableCell className="align-top">
                        <Badge variant={project.criticalIssues > 0 ? "destructive" : "secondary"}>
                          {project.criticalIssues}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-40 align-top">{project.nextMilestone}</TableCell>
                      <TableCell className="align-top">
                        <Button
                          nativeButton={false}
                          render={<Link href={`/projects/${project.id}`} />}
                          size="sm"
                          variant="outline"
                        >
                          Show project
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                      No projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedProjects.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-
                {Math.min(currentPage * PAGE_SIZE, projectMetrics.length)} of {projectMetrics.length} projects
              </p>
              <div className="flex items-center gap-2">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setPage(1)}
                  variant="outline"
                  size="sm"
                >
                  <ChevronsLeft />
                </Button>
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft />
                </Button>
                <Badge variant="outline">{currentPage}</Badge>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight />
                </Button>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(totalPages)}
                  variant="outline"
                  size="sm"
                >
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
