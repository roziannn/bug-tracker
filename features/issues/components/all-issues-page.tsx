"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Download, ListFilter, Search, ShieldAlert, TimerReset, TriangleAlert } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  issues,
  priorityVariant,
  statusVariant,
  type IssueRecord,
  type IssueStatus,
  type Priority,
} from "@/features/bug-tracker/data/bug-tracker-data";

const PAGE_SIZE = 6;

type LabelFilter = string | "None" | "all";
type StatusFilter = IssueStatus | "all";
type PriorityFilter = Priority | "all";

const stats = [
  {
    title: "Total open",
    value: "34",
    change: "+12.4%",
    note: "Compared with last week",
    icon: TimerReset,
  },
  {
    title: "In progress",
    value: "18",
    change: "+6.1%",
    note: "Across active squads",
    icon: ListFilter,
  },
  {
    title: "Critical blockers",
    value: "4",
    change: "+2.0%",
    note: "Need same-day action",
    icon: TriangleAlert,
  },
  {
    title: "Closed",
    value: "29",
    change: "+18.7%",
    note: "Resolved this week",
    icon: ShieldAlert,
  },
] as const;

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

function exportIssuesToCsv(rows: IssueRecord[]) {
  const headers = ["Ticket ID", "Title", "Status", "Priority", "Label", "Created Date"];
  const values = rows.map((issue) => [
    issue.id,
    issue.title,
    issue.status,
    issue.priority,
    issue.label,
    issue.createdAt,
  ]);

  const csv = [headers, ...values]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "bug-tracker-issues.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function IssuesToolbar({
  status,
  priority,
  label,
  onStatusChange,
  onPriorityChange,
  onLabelChange,
  onExport,
}: {
  status: StatusFilter;
  priority: PriorityFilter;
  label: LabelFilter;
  onStatusChange: (value: StatusFilter) => void;
  onPriorityChange: (value: PriorityFilter) => void;
  onLabelChange: (value: LabelFilter) => void;
  onExport: () => void;
}) {
  const labels = Array.from(new Set(issues.map((issue) => issue.label)));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Issue inventory</h2>
          <p className="text-sm text-muted-foreground">
            Track bug volume, filter by workflow state, and export the current view as CSV.
          </p>
        </div>
        <Button onClick={onExport} size="lg">
          <Download />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex w-full max-w-xl items-center gap-2 rounded-xl border bg-card px-3">
          <Search className="size-4 text-muted-foreground" />
          <Input
            aria-label="Search issues"
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            placeholder="Search ticket id, title, or label..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={(value) => onStatusChange(value as StatusFilter)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="Backlog">Backlog</SelectItem>
              <SelectItem value="Ready">Ready</SelectItem>
              <SelectItem value="Investigating">Investigating</SelectItem>
              <SelectItem value="In review">In review</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priority}
            onValueChange={(value) => onPriorityChange(value as PriorityFilter)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priority</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={label} onValueChange={(value) => onLabelChange(value as LabelFilter)}>
            <SelectTrigger>
              <SelectValue placeholder="Label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All labels</SelectItem>
              <SelectItem value="None">None</SelectItem>
              {labels.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export function AllIssuesPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [labelFilter, setLabelFilter] = useState<LabelFilter>("all");
  const [page, setPage] = useState(1);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const statusMatch = statusFilter === "all" || issue.status === statusFilter;
      const priorityMatch = priorityFilter === "all" || issue.priority === priorityFilter;
      const labelMatch =
        labelFilter === "all"
          ? true
          : labelFilter === "None"
            ? issue.label === "None"
            : issue.label === labelFilter;

      return statusMatch && priorityMatch && labelMatch;
    });
  }, [labelFilter, priorityFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredIssues.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <AppShell
      activeNav="issues"
      eyebrow="Issue registry"
      title="All Issues"
      toolbar={
        <IssuesToolbar
          label={labelFilter}
          onExport={() => exportIssuesToCsv(filteredIssues)}
          onLabelChange={(value) => {
            setLabelFilter(value);
            setPage(1);
          }}
          onPriorityChange={(value) => {
            setPriorityFilter(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          priority={priorityFilter}
          status={statusFilter}
        />
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardDescription>{item.title}</CardDescription>
                      <CardTitle className="mt-2 text-3xl">{item.value}</CardTitle>
                    </div>
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                  </div>
                </CardHeader>
                <CardFooter className="justify-between">
                  <Badge variant="secondary">{item.change}</Badge>
                  <span className="text-xs text-muted-foreground">{item.note}</span>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Issue table</CardTitle>
            <CardDescription>
              Filter current bug inventory by workflow state, severity, and label.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedIssues.length ? (
                  paginatedIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="max-w-xl font-medium">{issue.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{issue.label}</Badge>
                            <span className="text-xs text-muted-foreground">{issue.team}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(issue.status)}>{issue.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={priorityVariant(issue.priority)}>{issue.priority}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(issue.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          nativeButton={false}
                          render={<Link href={`/issues/${issue.id}`} />}
                          size="sm"
                          variant="outline"
                        >
                          Show issue
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No issues match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedIssues.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-
                {Math.min(currentPage * PAGE_SIZE, filteredIssues.length)} of {filteredIssues.length} issues
              </p>
              <div className="flex items-center gap-2">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  variant="outline"
                >
                  Previous
                </Button>
                <Badge variant="outline">
                  Page {currentPage} / {totalPages}
                </Badge>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
