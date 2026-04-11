"use client";

import { KeyRound, ShieldCheck, UserCog } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SettingsSubnav } from "@/features/settings/components/settings-subnav";

const permissionRows = [
  { role: "Admin", manageMenu: "Yes", managePermissions: "Yes", manageEnvironment: "Yes" },
  { role: "Lead", manageMenu: "Limited", managePermissions: "No", manageEnvironment: "View only" },
  { role: "Engineer", manageMenu: "No", managePermissions: "No", manageEnvironment: "No" },
  { role: "QA", manageMenu: "No", managePermissions: "No", manageEnvironment: "View only" },
] as const;

export function PermissionSettingsPage() {
  return (
    <AppShell
      activeNav="settings"
      eyebrow="Configuration"
      title="Settings"
      toolbar={
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Permission settings</h2>
            <p className="text-sm text-muted-foreground">
              Atur role access untuk menu konfigurasi, permission management, dan environment exposure.
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
                  <CardDescription>Roles tracked</CardDescription>
                  <CardTitle className="mt-2 text-3xl">4</CardTitle>
                </div>
                <UserCog className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Admin, Lead, Engineer, dan QA punya scope akses berbeda.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Protected areas</CardDescription>
                  <CardTitle className="mt-2 text-3xl">3</CardTitle>
                </div>
                <ShieldCheck className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Menu config, permission config, dan environment config.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Access policy</CardDescription>
                  <CardTitle className="mt-2 text-3xl">RBAC</CardTitle>
                </div>
                <KeyRound className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Permission menggunakan role-based access control.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Role matrix</CardTitle>
            <CardDescription>
              Ringkasan hak akses tiap role untuk area settings utama.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Menu settings</TableHead>
                  <TableHead>Permission settings</TableHead>
                  <TableHead>Environment settings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionRows.map((row) => (
                  <TableRow key={row.role}>
                    <TableCell className="font-medium">{row.role}</TableCell>
                    <TableCell>
                      <Badge variant={row.manageMenu === "Yes" ? "secondary" : "outline"}>
                        {row.manageMenu}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.managePermissions === "Yes" ? "secondary" : "outline"}>
                        {row.managePermissions}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          row.manageEnvironment === "Yes"
                            ? "secondary"
                            : row.manageEnvironment === "No"
                              ? "outline"
                              : "default"
                        }
                      >
                        {row.manageEnvironment}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
