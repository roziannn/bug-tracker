"use client";

import { useMemo, useState } from "react";
import { GripVertical, ListFilter, Search } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  issues as initialIssues,
  kanbanColumns,
  priorityVariant,
  type IssueRecord,
  type IssueStatus,
} from "@/features/bug-tracker/data/bug-tracker-data";

type DragState = {
  issueId: string | null;
  overColumn: IssueStatus | null;
};

function KanbanToolbar() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Kanban flow and triage</h2>
        <p className="text-sm text-muted-foreground">
          Pantau alur issue aktif dan pindahkan status bug langsung dari board.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto lg:justify-end">
        <div className="flex w-full min-w-0 sm:min-w-72 items-center gap-2 rounded-xl border bg-card px-3 sm:w-auto">
          <Search className="size-4 text-muted-foreground" />
          <Input
            aria-label="Search board"
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            placeholder="Search cards, assignees, teams, or bug ids..."
          />
        </div>
        <Select defaultValue="critical-high">
          <SelectTrigger>
            <ListFilter />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="critical-high">Critical + High</SelectItem>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="frontend">Frontend only</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="sprint-12">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sprint-12">Sprint 12</SelectItem>
            <SelectItem value="hotfix">Hotfix lane</SelectItem>
            <SelectItem value="backlog">Backlog review</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function IssueCard({
  issue,
  dragging,
  onDragStart,
  onDragEnd,
}: {
  issue: IssueRecord;
  dragging: boolean;
  onDragStart: (issueId: string) => void;
  onDragEnd: () => void;
}) {
  return (
    <Card
      draggable
      onDragStart={() => onDragStart(issue.id)}
      onDragEnd={onDragEnd}
      className={cn(
        "cursor-grab border-border/80 bg-card/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing",
        dragging && "opacity-55 ring-2 ring-primary/30"
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-sm">{issue.id}</CardTitle>
            <CardDescription className="mt-1 leading-6 text-foreground/90">
              {issue.title}
            </CardDescription>
          </div>
          <GripVertical className="mt-0.5 size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={priorityVariant(issue.priority)}>{issue.priority}</Badge>
          <Badge variant="outline">{issue.team}</Badge>
        </div>
        {issue.summary ? (
          <p className="text-sm leading-6 text-muted-foreground">{issue.summary}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function KanbanColumnView({
  id,
  title,
  description,
  issues,
  isOver,
  draggingId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: {
  id: IssueStatus;
  title: string;
  description: string;
  issues: IssueRecord[];
  isOver: boolean;
  draggingId: string | null;
  onDragStart: (issueId: string) => void;
  onDragEnd: () => void;
  onDragOver: (column: IssueStatus) => void;
  onDrop: (column: IssueStatus) => void;
}) {
  return (
    <Card
      className={cn(
        "relative flex h-full min-h-[32rem] flex-col border border-border/80 bg-muted/20 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border/80 before:content-['']",
        isOver && "border-primary bg-primary/5 before:bg-primary shadow-sm"
      )}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver(id);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(id);
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="secondary">{issues.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 rounded-lg flex-col gap-3 p-3">
        {issues.length ? (
          issues.map((issue) => (
            <IssueCard
              key={issue.id}
              dragging={draggingId === issue.id}
              issue={issue}
              onDragEnd={onDragEnd}
              onDragStart={onDragStart}
            />
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed bg-background/70 px-4 text-center text-sm text-muted-foreground">
            Drop bug cards here.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function KanbanBoard() {
  const [issues, setIssues] = useState<IssueRecord[]>(initialIssues);
  const [dragState, setDragState] = useState<DragState>({
    issueId: null,
    overColumn: null,
  });

  const groupedIssues = useMemo(
    () =>
      kanbanColumns.map((column) => ({
        ...column,
        issues: issues.filter((issue) => issue.status === column.id),
      })).filter((column) => column.id !== "Backlog"),
    [issues]
  );

  function moveIssue(issueId: string, nextStatus: IssueStatus) {
    setIssues((current) =>
      current.map((issue) =>
        issue.id === issueId ? { ...issue, status: nextStatus } : issue
      )
    );
  }

  return (
    <AppShell
      activeNav="kanban"
      eyebrow="Sprint workflow"
      title="Bug Triage Kanban"
      toolbar={<KanbanToolbar />}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-1">
              <CardTitle>Kanban Board</CardTitle>
              <CardDescription>
                Drag and drop ringkasan alur triage, perpindahan status issue, dan distribusi beban kerja aktif dalam satu board.
              </CardDescription>
            </div>

            <Dialog>
              <DialogTrigger
                render={
                  <Button className="shrink-0" variant="outline">
                    View board rules
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Kanban board rules</DialogTitle>
                  <DialogDescription>
                    Semua aturan utama buat triage flow, status movement, dan kondisi board saat ini.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <p className="font-medium">Triage SLA</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Critical issues should leave backlog within 2 hours. High priority issues should reach investigation on the same business day.
                    </p>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-4">
                    <p className="font-medium">Workflow hint</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Keep cards in ready only when reproduction steps, owner, and fix scope are clear enough for engineering pickup.
                    </p>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-4">
                    <p className="font-medium">Current board health</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge>2 critical in review</Badge>
                      <Badge variant="secondary">3 waiting for QA</Badge>
                      <Badge variant="outline">1 rollback verified</Badge>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="grid min-w-[58rem] gap-4 xl:grid-cols-4">
            {groupedIssues.map((column) => (
              <KanbanColumnView
                key={column.id}
                description={column.description}
                draggingId={dragState.issueId}
                id={column.id}
                isOver={dragState.overColumn === column.id}
                issues={column.issues}
                onDragEnd={() => setDragState({ issueId: null, overColumn: null })}
                onDragOver={(nextColumn) =>
                  setDragState((current) => ({ ...current, overColumn: nextColumn }))
                }
                onDragStart={(issueId) => setDragState({ issueId, overColumn: null })}
                onDrop={(nextColumn) => {
                  if (dragState.issueId) moveIssue(dragState.issueId, nextColumn);
                  setDragState({ issueId: null, overColumn: null });
                }}
                title={column.title}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
