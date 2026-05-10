"use client";

import Link from "next/link";
import { Activity, CalendarDays, Flag, Hash, Link2, Server, ShieldAlert, UserRound, Users } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectById, projectStatusVariant } from "@/features/bug-tracker/data/bug-tracker-data";

export function ProjectDetailPage({ id }: { id: string }) {
  const project = getProjectById(id);

  if (!project) {
    return (
      <AppShell
        activeNav="projects"
        breadcrumbs={[
          { label: "Projects", href: "/projects" },
          { label: "Project Detail" },
        ]}
        eyebrow="Project routing"
        title="Project Detail"
      >
        <Card>
          <CardHeader>
            <CardTitle>Project not found</CardTitle>
            <CardDescription>
              Project dengan id `{id}` belum ada di source data saat ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              nativeButton={false}
              render={<Link href="/projects" />}
              variant="outline"
            >
              Back to projects
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeNav="projects"
      breadcrumbs={[
        { label: "Projects", href: "/projects" },
        { label: project.name },
      ]}
      eyebrow="Project routing"
      title={project.name}
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Project detail</h2>
            <p className="text-sm text-muted-foreground">
              Ringkasan lengkap project, owner, environment, repository, dan milestone.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/projects" />}
            variant="outline"
          >
            Back to projects
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </div>
              <Badge variant={projectStatusVariant(project.status)}>
                <Activity className="size-3.5" />
                {project.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-x-6 gap-y-5 pt-0 text-sm md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Hash className="size-4" />
                Project ID
              </p>
              <Badge className="max-w-full justify-start break-all font-mono" variant="outline">
                {project.id}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <UserRound className="size-4" />
                Owner
              </p>
              <p className="font-medium">{project.owner}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Users className="size-4" />
                Team
              </p>
              <p className="font-medium">{project.team}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Server className="size-4" />
                Environment
              </p>
              <p className="font-medium">{project.environment}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Link2 className="size-4" />
                Repository
              </p>
              <p className="break-all font-medium">{project.repository}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <CalendarDays className="size-4" />
                Created at
              </p>
              <p className="font-medium">{project.createdAt}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery health</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <ShieldAlert className="size-4" />
                  Open issues
                </p>
                <p className="mt-1 text-3xl font-semibold">{project.openIssues}</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <ShieldAlert className="size-4" />
                  Critical issues
                </p>
                <p className="mt-1 text-3xl font-semibold">{project.criticalIssues}</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Flag className="size-4" />
                  Next milestone
                </p>
                <p className="mt-1 font-medium">{project.nextMilestone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
