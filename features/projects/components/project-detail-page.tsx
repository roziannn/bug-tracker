"use client";

import Link from "next/link";

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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </div>
              <Badge variant={projectStatusVariant(project.status)}>{project.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Project ID</p>
              <p className="mt-1 break-all font-mono text-sm">{project.id}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Owner</p>
              <p className="mt-1 font-medium">{project.owner}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Team</p>
              <p className="mt-1 font-medium">{project.team}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Environment</p>
              <p className="mt-1 font-medium">{project.environment}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Repository</p>
              <p className="mt-1 break-all text-sm">{project.repository}</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">Created at</p>
              <p className="mt-1 font-medium">{project.createdAt}</p>
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
                <p className="text-xs text-muted-foreground">Open issues</p>
                <p className="mt-1 text-3xl font-semibold">{project.openIssues}</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Critical issues</p>
                <p className="mt-1 text-3xl font-semibold">{project.criticalIssues}</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Next milestone</p>
                <p className="mt-1 font-medium">{project.nextMilestone}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
