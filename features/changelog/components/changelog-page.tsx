"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { changelogEntries } from "@/features/bug-tracker/data/bug-tracker-data";
import { GitBranch, PackageCheck, ShieldAlert, Sparkles } from "lucide-react";

const featureReleaseCount = changelogEntries.filter((entry) => entry.category === "Feature").length;
const fixReleaseCount = changelogEntries.filter((entry) => entry.category === "Fix").length;

const changelogStats = [
  {
    label: "Latest release",
    value: "v2.8.1",
    change: "Current",
    note: "Current release in workspace",
    icon: Sparkles,
  },
  {
    label: "Tracked updates",
    value: String(changelogEntries.length),
    change: `${changelogEntries.length} notes`,
    note: "Release notes logged",
    icon: GitBranch,
  },
  {
    label: "Feature drops",
    value: String(featureReleaseCount),
    change: `${featureReleaseCount} shipped`,
    note: "New capabilities added",
    icon: ShieldAlert,
  },
  {
    label: "Stability fixes",
    value: String(fixReleaseCount),
    change: `${fixReleaseCount} patch`,
    note: "Reliability improvements",
    icon: PackageCheck,
  },
] as const;

function changelogVariant(category: "Feature" | "Improvement" | "Fix") {
  if (category === "Feature") return "default";
  if (category === "Improvement") return "secondary";
  return "outline";
}

export function ChangelogPage() {
  return (
    <AppShell
      activeNav="changelog"
      eyebrow="Release journal"
      title="Changelog"
      toolbar={
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Product evolution log</h2>
          <p className="text-sm text-muted-foreground">
            Track what changed in the bug tracker across features, workflow improvements, and stability updates.
          </p>
        </div>
      }
    >
      <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
  {changelogStats.map((item) => {
    const Icon = item.icon;

    return (
      <Card key={item.label} className="h-full">
        <CardHeader className="h-full">
          <div className="flex h-full items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 flex-col">
              <CardDescription className="truncate font-semibold">
                {item.label}
              </CardDescription>

              <CardDescription className="mt-1 truncate">
                {item.note}
              </CardDescription>

              <div className="mt-3 flex items-center gap-3">
                <CardTitle className="text-4xl leading-none">
                  {item.value}
                </CardTitle>

                <Badge variant="secondary" className="translate-y-0.5">
                  {item.change}
                </Badge>
              </div>
            </div>

            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
          </div>
        </CardHeader>
      </Card>
    );
  })}
</div>
        <div className="space-y-4">
          {changelogEntries.map((entry, index) => (
            <Card key={entry.version}>
              <CardHeader>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {index === 0 ? <Badge>Latest</Badge> : null}
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
                <ul className="space-y-3">
                  {entry.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-sm leading-6">
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                {index < changelogEntries.length - 1 ? <Separator /> : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
