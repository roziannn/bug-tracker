"use client";

import { CloudCog, DatabaseZap, ServerCog } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsSubnav } from "@/features/settings/components/settings-subnav";

const environments = [
  {
    name: "Development",
    apiBase: "http://localhost:3000/api",
    database: "Local Postgres",
    status: "Active",
  },
  {
    name: "Staging",
    apiBase: "https://staging.bugtracker.internal/api",
    database: "Managed Postgres",
    status: "Synced",
  },
  {
    name: "Production",
    apiBase: "https://bugtracker.company.com/api",
    database: "Primary cluster",
    status: "Protected",
  },
] as const;

export function EnvironmentSettingsPage() {
  return (
    <AppShell
      activeNav="settings"
      eyebrow="Configuration"
      title="Settings"
      toolbar={
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Environment settings</h2>
            <p className="text-sm text-muted-foreground">
              Lihat environment yang dipakai app, endpoint aktif, dan status koneksi utama.
            </p>
          </div>
          <SettingsSubnav />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Runtime target</CardDescription>
                  <CardTitle className="mt-2 text-3xl">Next.js</CardTitle>
                </div>
                <CloudCog className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configuration dipetakan untuk App Router dan deployment modern.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Service mode</CardDescription>
                  <CardTitle className="mt-2 text-3xl">3 envs</CardTitle>
                </div>
                <ServerCog className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Development, staging, dan production sudah terpetakan.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Database profile</CardDescription>
                  <CardTitle className="mt-2 text-3xl">Postgres</CardTitle>
                </div>
                <DatabaseZap className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Semua env memakai profile database yang berbeda sesuai kebutuhan.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {environments.map((environment) => (
            <Card key={environment.name}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{environment.name}</CardTitle>
                    <CardDescription>{environment.apiBase}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      environment.status === "Protected"
                        ? "destructive"
                        : environment.status === "Synced"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {environment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Database</p>
                  <p className="font-medium">{environment.database}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Endpoint</p>
                  <p className="break-all text-sm">{environment.apiBase}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
