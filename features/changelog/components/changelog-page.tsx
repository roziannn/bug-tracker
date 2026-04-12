"use client";

import { ArrowUpRight, GitBranch, ShieldAlert, Sparkles } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { changelogEntries } from "@/features/bug-tracker/data/bug-tracker-data";

const changelogStats = [
  {
    label: "Latest release",
    value: "v2.8.1",
    note: "Current release running in workspace",
    icon: Sparkles,
  },
  {
    label: "Tracked updates",
    value: String(changelogEntries.length),
    note: "Release notes available in this app",
    icon: GitBranch,
  },
  {
    label: "Focus areas",
    value: "Projects, Teams, Settings",
    note: "Largest recent surface area of change",
    icon: ShieldAlert,
  },
] as const;

function changelogVariant(category: "Feature" | "Improvement" | "Fix") {
  if (category === "Feature") return "default";
  if (category === "Improvement") return "secondary";
  return "outline";
}

export function ChangelogPage() {
  const latestEntry = changelogEntries[0];

  return (
    <AppShell
      activeNav="changelog"
      eyebrow="Release journal"
      title="Changelog"
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Product evolution log</h2>
            <p className="text-sm text-muted-foreground">
              Track what changed in the bug tracker across features, workflow improvements, and stability updates.
            </p>
          </div>
          <Badge variant="secondary">Latest: {latestEntry.version}</Badge>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {changelogStats.map((item) => {
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
                  <Badge variant="outline">Release note</Badge>
                  <span className="text-xs text-muted-foreground">{item.note}</span>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <Badge variant={changelogVariant(latestEntry.category)}>{latestEntry.category}</Badge>
                <CardTitle className="text-2xl">{latestEntry.headline}</CardTitle>
                <CardDescription className="max-w-3xl text-base">
                  {latestEntry.summary}
                </CardDescription>
              </div>
              <div className="rounded-xl border bg-background px-4 py-3">
                <p className="text-xs text-muted-foreground">Released</p>
                <p className="mt-1 font-medium">{latestEntry.releasedOn}</p>
                <p className="text-sm text-muted-foreground">{latestEntry.version}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-6 md:grid-cols-3">
            {latestEntry.highlights.map((highlight) => (
              <div key={highlight} className="rounded-xl border bg-background p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ArrowUpRight className="size-4" />
                  </span>
                  <p className="text-sm leading-6">{highlight}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {changelogEntries.map((entry, index) => (
            <Card key={entry.version}>
              <CardHeader>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={changelogVariant(entry.category)}>{entry.category}</Badge>
                      <Badge variant="outline">{entry.version}</Badge>
                    </div>
                    <CardTitle>{entry.headline}</CardTitle>
                    <CardDescription className="max-w-3xl">{entry.summary}</CardDescription>
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.releasedOn}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  {entry.highlights.map((highlight) => (
                    <div key={highlight} className="rounded-xl border bg-muted/20 p-4">
                      <p className="text-sm leading-6">{highlight}</p>
                    </div>
                  ))}
                </div>
                {index < changelogEntries.length - 1 ? <Separator /> : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
