"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { SettingsSubnav } from "@/features/settings/components/settings-subnav";

type AccessLevel = "Yes" | "No" | "Limited" | "View only";

type PermissionRow = {
  role: string;
  manageMenu: AccessLevel;
  managePermissions: AccessLevel;
  manageEnvironment: AccessLevel;
};

const initialPermissionRows: PermissionRow[] = [
  { role: "Admin", manageMenu: "Yes", managePermissions: "Yes", manageEnvironment: "Yes" },
  { role: "Lead", manageMenu: "Limited", managePermissions: "No", manageEnvironment: "View only" },
  { role: "Engineer", manageMenu: "No", managePermissions: "No", manageEnvironment: "No" },
  { role: "QA", manageMenu: "No", managePermissions: "No", manageEnvironment: "View only" },
];

const PAGE_SIZE = 4;

function accessBadgeVariant(value: AccessLevel) {
  if (value === "Yes") return "secondary";
  if (value === "Limited" || value === "View only") return "default";
  return "outline";
}

type PermissionSettingsPageProps = {
  mode?: "permission" | "role";
};

export function PermissionSettingsPage({ mode = "permission" }: PermissionSettingsPageProps) {
  const [permissionRows, setPermissionRows] = useState<PermissionRow[]>(initialPermissionRows);
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [manageMenu, setManageMenu] = useState<AccessLevel>("No");
  const [managePermissions, setManagePermissions] = useState<AccessLevel>("No");
  const [manageEnvironment, setManageEnvironment] = useState<AccessLevel>("No");
  const totalPages = Math.max(1, Math.ceil(permissionRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedPermissionRows = useMemo(
    () => permissionRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, permissionRows]
  );
  const isRoleMode = mode === "role";
  const pageLabel = isRoleMode ? "Role Settings" : "Permission Settings";
  const headingLabel = isRoleMode ? "Role settings" : "Permission settings";
  const headingDescription = isRoleMode
    ? "Kelola role access untuk menu, permission, dan environment exposure langsung dari satu tabel."
    : "Edit role access untuk menu settings, permission management, dan environment exposure langsung dari tabel.";

  function updatePermission(index: number, field: keyof Omit<PermissionRow, "role">, value: AccessLevel) {
    setPermissionRows((current) =>
      current.map((row, currentIndex) =>
        currentIndex === index
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  }

  function createRole() {
    if (!roleName.trim()) {
      return;
    }

    setPermissionRows((current) => [
      ...current,
      {
        role: roleName.trim(),
        manageMenu,
        managePermissions,
        manageEnvironment,
      },
    ]);

    setRoleName("");
    setManageMenu("No");
    setManagePermissions("No");
    setManageEnvironment("No");
    setIsCreateDialogOpen(false);
  }

  return (
    <AppShell
      activeNav="settings"
      breadcrumbs={[
        { label: "Settings", href: "/settings/menu" },
        { label: pageLabel },
      ]}
      eyebrow="Configuration"
      title="Settings"
      toolbar={
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{headingLabel}</h2>
            <p className="text-sm text-muted-foreground">{headingDescription}</p>
          </div>
          <SettingsSubnav />
        </div>
      }
    >
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Role matrix</CardTitle>
                <CardDescription>
                  Semua permission role bisa diedit inline tanpa membuka card detail.
                </CardDescription>
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger render={<Button />}>
                  <Plus />
                  Add Role
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add new role</DialogTitle>
                    <DialogDescription>
                      Tambahkan role baru dan tentukan akses default untuk setiap area settings.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="role-name" className="text-sm font-medium">
                        Role name
                      </label>
                      <Input
                        id="role-name"
                        value={roleName}
                        onChange={(event) => setRoleName(event.target.value)}
                        placeholder="Contoh: Product Manager"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Menu settings</label>
                      <Select value={manageMenu} onValueChange={(value) => setManageMenu(value as AccessLevel)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="Limited">Limited</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="View only">View only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Permission settings</label>
                      <Select value={managePermissions} onValueChange={(value) => setManagePermissions(value as AccessLevel)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="Limited">Limited</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="View only">View only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Environment settings</label>
                      <Select value={manageEnvironment} onValueChange={(value) => setManageEnvironment(value as AccessLevel)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="Limited">Limited</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="View only">View only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter showCloseButton>
                    <Button onClick={createRole}>
                      <Plus />
                      Add role
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
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
                {paginatedPermissionRows.map((row, index) => {
                  const absoluteIndex = (currentPage - 1) * PAGE_SIZE + index;

                  return (
                  <TableRow key={row.role}>
                    <TableCell className="font-medium">{row.role}</TableCell>
                    <TableCell className="min-w-48">
                      <div className="flex items-center gap-2">
                        <Select
                          value={row.manageMenu}
                          onValueChange={(value) => updatePermission(absoluteIndex, "manageMenu", value as AccessLevel)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="Limited">Limited</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="View only">View only</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge variant={accessBadgeVariant(row.manageMenu)}>{row.manageMenu}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-48">
                      <div className="flex items-center gap-2">
                        <Select
                          value={row.managePermissions}
                          onValueChange={(value) => updatePermission(absoluteIndex, "managePermissions", value as AccessLevel)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="Limited">Limited</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="View only">View only</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge variant={accessBadgeVariant(row.managePermissions)}>{row.managePermissions}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-48">
                      <div className="flex items-center gap-2">
                        <Select
                          value={row.manageEnvironment}
                          onValueChange={(value) => updatePermission(absoluteIndex, "manageEnvironment", value as AccessLevel)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="Limited">Limited</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="View only">View only</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge variant={accessBadgeVariant(row.manageEnvironment)}>{row.manageEnvironment}</Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedPermissionRows.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(currentPage * PAGE_SIZE, permissionRows.length)} of {permissionRows.length} roles
              </p>
              <TablePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
