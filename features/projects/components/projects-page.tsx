"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BriefcaseBusiness, Download, Eye, Flag, Plus, Search, ShieldAlert, UserRound } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  projectMetrics,
  projectOptions,
  projectStatusVariant,
} from "@/features/bug-tracker/data/bug-tracker-data";

const PAGE_SIZE = 4;
type ProjectStatusFilter = (typeof projectMetrics)[number]["status"] | "all";
type ProjectTeamFilter = (typeof projectMetrics)[number]["team"] | "all";

function truncateProjectDescription(value: string, maxLength = 30) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

function exportProjectsToCsv(rows: typeof projectMetrics) {
  const headers = [
    "Project",
    "Description",
    "Team",
    "Owner",
    "Status",
    "Open Issues",
    "Critical Issues",
    "Next Milestone",
  ];

  const values = rows.map((project) => [
    project.name,
    project.description,
    project.team,
    project.owner,
    project.status,
    project.openIssues,
    project.criticalIssues,
    project.nextMilestone,
  ]);

  const csv = [headers, ...values]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "project-portfolio.csv";
  link.click();
  URL.revokeObjectURL(url);
}

const projectHighlights = [
  {
    label: "Tracked projects",
    value: String(projectOptions.length),
    icon: BriefcaseBusiness,
    change: "+12.5%",
    note: "Delivery streams mapped.",
  },
  {
    label: "Critical projects",
    value: String(projectMetrics.filter((project) => project.criticalIssues > 0).length),
    icon: ShieldAlert,
    change: "+4.0%",
    note: "Critical issues monitored.",
  },
  {
    label: "Upcoming milestones",
    value: "4",
    icon: Flag,
    change: "+8.2%",
    note: "Milestones aligned.",
  },
  {
    label: "Active owners",
    value: String(new Set(projectMetrics.map((project) => project.owner)).size),
    icon: UserRound,
    change: "+6.3%",
    note: "Ownership distributed.",
  },
] as const;

export function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("all");
  const [teamFilter, setTeamFilter] = useState<ProjectTeamFilter>("all");
  const [page, setPage] = useState(1);
  const teamOptions = Array.from(new Set(projectMetrics.map((project) => project.team)));
  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return projectMetrics.filter((project) => {
      const statusMatch = statusFilter === "all" || project.status === statusFilter;
      const teamMatch = teamFilter === "all" || project.team === teamFilter;
      const searchMatch =
        !normalizedQuery ||
        project.name.toLowerCase().includes(normalizedQuery) ||
        project.description.toLowerCase().includes(normalizedQuery) ||
        project.owner.toLowerCase().includes(normalizedQuery);

      return statusMatch && teamMatch && searchMatch;
    });
  }, [searchQuery, statusFilter, teamFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProjects = useMemo(
    () =>
      filteredProjects.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [currentPage, filteredProjects]
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
      <div className="min-w-0 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {projectHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.label}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardDescription>{item.label}</CardDescription>
                      <CardTitle className="mt-2 text-3xl">{item.value}</CardTitle>
                      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
                        <Badge variant="secondary">{item.change}</Badge>
                        <span className="min-w-0 text-xs text-muted-foreground">{item.note}</span>
                      </div>
                    </div>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-1.5">
              <CardTitle>Project portfolio</CardTitle>
              <CardDescription>
                Daftar project aktif dengan status, owner, milestone, dan tekanan issue saat ini.
              </CardDescription>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto lg:justify-end">
              <div className="flex w-full min-w-0 sm:min-w-56 items-center gap-2 rounded-xl border bg-card px-3 sm:w-auto">
                <Search className="size-4 text-muted-foreground" />
                <Input
                  aria-label="Search projects"
                  className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search project..."
                  value={searchQuery}
                />
              </div>
              <Select
                onValueChange={(value) => {
                  setStatusFilter(value as ProjectStatusFilter);
                  setPage(1);
                }}
                value={statusFilter}
              >
                <SelectTrigger className="h-9 w-auto min-w-[88px] px-2.5">
                  <SelectValue placeholder="all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="At risk">At risk</SelectItem>
                  <SelectItem value="Needs focus">Needs focus</SelectItem>
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => {
                  setTeamFilter(value as ProjectTeamFilter);
                  setPage(1);
                }}
                value={teamFilter}
              >
                <SelectTrigger className="h-9 w-auto min-w-[88px] px-2.5">
                  <SelectValue placeholder="all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all</SelectItem>
                  {teamOptions.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => exportProjectsToCsv(filteredProjects)} variant="secondary">
                <Download />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full overflow-x-auto">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[13%]">Project</TableHead>
                    <TableHead className="w-[8%]">Team</TableHead>
                    <TableHead className="w-[12%]">Owner</TableHead>
                    <TableHead className="w-[8%]">Status</TableHead>
                    <TableHead className="w-[5%]">Issues</TableHead>
                    <TableHead className="w-[5%]">Critical</TableHead>
                    <TableHead className="w-[12%]">Next milestone</TableHead>
                    <TableHead className="w-[5%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProjects.length ? (
                    paginatedProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="align-top font-medium whitespace-normal break-words">
                          {project.name}
                        </TableCell>
                    
                        <TableCell className="align-top whitespace-normal break-words">{project.team}</TableCell>
                        <TableCell className="align-top whitespace-normal break-words">{project.owner}</TableCell>
                        <TableCell className="align-top whitespace-normal">
                          <Badge variant={projectStatusVariant(project.status)}>{project.status}</Badge>
                        </TableCell>
                        <TableCell className="align-top">{project.openIssues}</TableCell>
                        <TableCell className="align-top">
                          <Badge variant={project.criticalIssues > 0 ? "destructive" : "secondary"}>
                            {project.criticalIssues}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top whitespace-normal break-words">{project.nextMilestone}</TableCell>
                        <TableCell className="align-top whitespace-normal">
                          <Button
                            nativeButton={false}
                            render={<Link href={`/projects/${project.id}`} />}
                            size="sm"
                            variant="outline"
                          >
                            <Eye />
                            Show
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
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedProjects.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-
                {Math.min(currentPage * PAGE_SIZE, filteredProjects.length)} of {filteredProjects.length} projects
              </p>
              <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
