"use client";

import { useState } from "react";
import Link from "next/link";
import { FileCode2, FileImage, FileText, Film } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getIssueById, getRelativeTime, priorityVariant, statusVariant } from "@/features/bug-tracker/data/bug-tracker-data";
import { appToast } from "@/lib/app-toast";

const issueEvidence = {
  "BUG-218": [
    {
      name: "upload-crash-repro.mp4",
      type: "Video reproduction",
      size: "18.4 MB",
      note: "QA capture showing app crash after uploading a 12.6 MB PNG file.",
      icon: Film,
    },
    {
      name: "memory-usage-spike.png",
      type: "Screenshot",
      size: "2.1 MB",
      note: "Heap usage peaks right before preview generation fails.",
      icon: FileImage,
    },
    {
      name: "cloud-function-error.log",
      type: "Runtime log",
      size: "184 KB",
      note: "Stack trace from upload worker with memory limit warning.",
      icon: FileCode2,
    },
  ],
  "BUG-214": [
    {
      name: "offline-reconnect-flow.mp4",
      type: "Video reproduction",
      size: "9.8 MB",
      note: "Queued comment gets submitted twice after reconnect event fires.",
      icon: Film,
    },
    {
      name: "request-timeline.txt",
      type: "Request trace",
      size: "54 KB",
      note: "Shows duplicated replay payloads in websocket recovery path.",
      icon: FileText,
    },
  ],
  default: [
    {
      name: "bug-evidence.png",
      type: "Screenshot",
      size: "1.4 MB",
      note: "Captured UI state from the latest reported reproduction.",
      icon: FileImage,
    },
    {
      name: "console-output.log",
      type: "Runtime log",
      size: "92 KB",
      note: "Relevant console and app trace collected during triage.",
      icon: FileCode2,
    },
  ],
} as const;

export function IssueDetailPage({ id }: { id: string }) {
  const issue = getIssueById(id);
  const evidenceItems = issueEvidence[issue?.id as keyof typeof issueEvidence] ?? issueEvidence.default;
  const [draftComment, setDraftComment] = useState("");
  const [comments, setComments] = useState(() => issue?.comments ?? []);

  function handlePostComment() {
    if (!draftComment.trim()) {
      appToast.error({
        title: "Comment is empty",
        description: "Write a quick update or note before posting it to the discussion thread.",
      });
      return;
    }

    setComments((current) => [
      ...current,
      {
        id: `comment-${Date.now()}`,
        author: "You",
        text: draftComment.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraftComment("");
    appToast.success({
      title: "Comment posted",
      description: "Your update has been added to the issue discussion.",
    });
  }

  if (!issue) {
    return (
      <AppShell activeNav="issues" eyebrow="Issue detail" title="Issue Not Found">
        <Card>
          <CardHeader>
            <CardTitle>Issue not found</CardTitle>
            <CardDescription>Issue dengan id `{id}` belum ada di source data saat ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} render={<Link href="/issues" />} variant="outline">
              Back to issues
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      activeNav="issues"
      eyebrow="Issue detail"
      title={issue.id}
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Issue details</h2>
            <p className="text-sm text-muted-foreground">Detailed view of the issue, status, and related metadata.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button nativeButton={false} render={<Link href="/issues" />} variant="outline">
              Back to issues
            </Button>
            <Button>Edit issue</Button>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{issue.id}</span>
                    <Badge variant="outline">{issue.label}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{issue.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">opened {getRelativeTime(issue.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={statusVariant(issue.status)}>{issue.status}</Badge>
                  <Badge variant={priorityVariant(issue.priority)}>{issue.priority}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Summary</h3>
                <p className="leading-relaxed">{issue.summary || "No summary provided."}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-y-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Assignee</p>
                  <p className="mt-0.5 font-medium">{issue.assignee}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Team</p>
                  <p className="mt-0.5 font-medium">{issue.team}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Label</p>
                  <p className="mt-0.5 font-medium">{issue.label}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="mt-0.5 font-medium">{issue.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discussion</CardTitle>
              <CardDescription>Share updates, ask questions, or provide feedback on this issue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="size-9">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback>
                        {comment.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{comment.author}</p>
                        <span className="text-xs text-muted-foreground">{getRelativeTime(comment.createdAt)}</span>
                      </div>
                      <div className="rounded-xl bg-muted/30 p-4 text-sm leading-relaxed">{comment.text}</div>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">No discussion yet. Be the first to comment.</div>}
              </div>

              <div className="flex gap-4 pt-4">
                <Avatar className="size-9">
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    className="min-h-25 resize-none"
                    onChange={(event) => setDraftComment(event.target.value)}
                    placeholder="Add a comment..."
                    value={draftComment}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handlePostComment}>Post comment</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
              <CardDescription>Attached files and captures related to this bug report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {evidenceItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.name} className="rounded-xl border bg-card p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.type}</p>
                          </div>
                          <Badge variant="outline">{item.size}</Badge>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>Activity log for this issue.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="relative border-l pb-4 pl-4 last:pb-0">
                  <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border bg-background" />
                  <p className="text-sm font-medium">Issue created</p>
                  <p className="text-xs text-muted-foreground">{issue.createdAt}</p>
                </div>
                <div className="relative border-l pb-4 pl-4 last:pb-0">
                  <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border bg-background" />
                  <p className="text-sm font-medium">Assigned to {issue.assignee}</p>
                  <p className="text-xs text-muted-foreground">{issue.createdAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
