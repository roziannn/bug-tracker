"use client";

import { CircleDot, GitBranch, ListFilter, Search, ShieldAlert, Sparkles } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  issues,
  overviewCards,
  priorityVariant,
  statusVariant,
} from "@/features/bug-tracker/data/bug-tracker-data";

const iconMap = {
  "circle-dot": CircleDot,
  "shield-alert": ShieldAlert,
  "git-branch": GitBranch,
  sparkles: Sparkles,
} as const;

function DashboardToolbar() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full max-w-xl items-center gap-2 rounded-xl border bg-card px-3">
        <Search className="size-4 text-muted-foreground" />
        <Input
          aria-label="Search issues"
          className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          placeholder="Search issues, tags, reporters, or release versions..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select defaultValue="all">
          <SelectTrigger>
            <ListFilter />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="review">In review</SelectItem>
            <SelectItem value="done">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="sprint-12">
          <SelectTrigger>
            <SelectValue placeholder="Sprint" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sprint-12">Sprint 12</SelectItem>
            <SelectItem value="sprint-11">Sprint 11</SelectItem>
            <SelectItem value="backlog">Backlog</SelectItem>
          </SelectContent>
        </Select>
        <AvatarGroup>
          {["RA", "MI", "AL"].map((name) => (
            <Avatar key={name} size="sm">
              <AvatarFallback>{name}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </div>
  );
}

export function DashboardOverview() {
  return (
    <AppShell
      activeNav="overview"
      eyebrow="Sprint board"
      title="Product Quality Dashboard"
      toolbar={<DashboardToolbar />}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = iconMap[card.icon];

          return (
            <Card key={card.label}>
              <CardHeader>
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="text-3xl">{card.value}</CardTitle>
              </CardHeader>
              <CardFooter className="justify-between">
                <span className="text-xs text-muted-foreground">{card.note}</span>
                <Icon className="size-4 text-muted-foreground" />
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Tabs className="mt-6 gap-4" defaultValue="active">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Issue flow</h2>
            <p className="text-sm text-muted-foreground">
              Shared components are already wired for cards, tables, dialogs, filters, and navigation.
            </p>
          </div>
          <TabsList variant="line">
            <TabsTrigger value="active">Active sprint</TabsTrigger>
            <TabsTrigger value="triage">Triage queue</TabsTrigger>
            <TabsTrigger value="resolved">Recently resolved</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="active">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Card>
              <CardHeader>
                <CardTitle>Priority issues</CardTitle>
                <CardDescription>
                  Current sprint focus across frontend, platform, and core squads.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Assignee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{issue.id}</p>
                            <p className="max-w-xl text-sm text-muted-foreground">{issue.title}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={priorityVariant(issue.priority)}>{issue.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(issue.status)}>{issue.status}</Badge>
                        </TableCell>
                        <TableCell>{issue.team}</TableCell>
                        <TableCell>
                          <Avatar size="sm">
                            <AvatarFallback>{issue.assignee}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Triage notes</CardTitle>
                <CardDescription>
                  Example panel for reusable cards, badges, inputs, and textarea fields.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border bg-muted/30 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">Crash cluster spike</p>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Android attachment uploads increased error volume by 38% after the latest rollout.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Quick handoff</p>
                  <Textarea
                    defaultValue="Need reproduction steps from QA and API logs from the upload gateway before the daily sync."
                    rows={6}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-xs text-muted-foreground">Last synced 8 minutes ago</span>
                <Button variant="outline">Share update</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="triage">
          <Card>
            <CardHeader>
              <CardTitle>Triage queue</CardTitle>
              <CardDescription>
                Use this tab as the starting point for backlog review or a dedicated `/triage` page.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>7 unassigned</Badge>
              <Badge variant="secondary">3 waiting for QA</Badge>
              <Badge variant="outline">2 blocked by backend logs</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle>Recently resolved</CardTitle>
              <CardDescription>
                Shared UI is ready for velocity reports, release summaries, or changelog views.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border p-4">
                <p className="font-medium">BUG-196 fixed in `v2.8.0`</p>
                <p className="text-sm text-muted-foreground">
                  Session timeout banner now respects retry state and no longer overlaps the editor toolbar.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="font-medium">BUG-188 fixed in `v2.7.9`</p>
                <p className="text-sm text-muted-foreground">
                  Webhook delivery retries now show consistent timestamps across UTC and local user settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
