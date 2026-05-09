"use client";

import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function CreateProjectPage() {
  return (
    <AppShell
      activeNav="projects"
      breadcrumbs={[
        { label: "Projects", href: "/projects" },
        { label: "Create Project" },
      ]}
      eyebrow="Project routing"
      title="Create Project"
      toolbar={
        <div>
          <h2 className="text-lg font-semibold tracking-tight">New project setup</h2>
          <p className="text-sm text-muted-foreground">
            Tambahkan project baru dengan data owner, team, environment, dan milestone utama.
          </p>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>
            Semua project baru akan memakai konsep ID GUID-style saat nanti disimpan ke source data atau backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input id="project-name" placeholder="Contoh: Analytics Console" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-owner">Owner</Label>
              <Input id="project-owner" placeholder="Contoh: Kevin Tan" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Team</Label>
              <Select defaultValue="Frontend">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Platform">Platform</SelectItem>
                  <SelectItem value="Core">Core</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Environment</Label>
              <Select defaultValue="Production">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Staging">Staging</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="project-repository">Repository</Label>
              <Input id="project-repository" placeholder="github.com/company/project-name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-milestone">Next milestone</Label>
              <Input id="project-milestone" placeholder="Contoh: Beta launch - May 2" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Jelaskan tujuan project, scope utama, dan kaitannya dengan bug tracker routing."
              rows={7}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/projects" />}
            variant="outline"
          >
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline">Save draft</Button>
            <Button>Create project</Button>
          </div>
        </CardFooter>
      </Card>
    </AppShell>
  );
}
