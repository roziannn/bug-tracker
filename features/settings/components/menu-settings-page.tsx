"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, EyeOff, Plus, Power, PowerOff } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SettingsSubnav } from "@/features/settings/components/settings-subnav";

type ManagedMenuItem = {
  id: string;
  label: string;
  group: string;
  href: string;
  role: string;
  active: boolean;
  visible: boolean;
};

const PAGE_SIZE = 4;

const initialMenus: ManagedMenuItem[] = [
  { id: "overview", label: "Overview", group: "Workspace", href: "/", role: "All members", active: true, visible: true },
  { id: "issues", label: "All Issues", group: "Workspace", href: "/issues", role: "All members", active: true, visible: true },
  { id: "kanban", label: "Kanban", group: "Workspace", href: "/kanban", role: "Engineering", active: true, visible: true },
  { id: "teams", label: "Teams", group: "Management", href: "/teams", role: "Leads", active: true, visible: true },
  { id: "projects", label: "Projects", group: "Management", href: "/projects", role: "Leads", active: true, visible: true },
  { id: "settings", label: "Settings", group: "Admin", href: "/settings/menu", role: "Admin only", active: true, visible: true },
] as const;

export function MenuSettingsPage() {
  const [menus, setMenus] = useState<ManagedMenuItem[]>(initialMenus);
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [group, setGroup] = useState("Workspace");
  const [role, setRole] = useState("All members");

  const totalPages = Math.max(1, Math.ceil(menus.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedMenus = useMemo(() => menus.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [currentPage, menus]);

  function toggleVisibility(id: string) {
    setMenus((current) => current.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)));
  }

  function toggleActive(id: string) {
    setMenus((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              active: !item.active,
              visible: item.active ? false : item.visible,
            }
          : item,
      ),
    );
  }

  function createMenu() {
    if (!label.trim() || !href.trim()) {
      return;
    }

    setMenus((current) => [
      ...current,
      {
        id: `${label.toLowerCase().replaceAll(/\s+/g, "-")}-${current.length + 1}`,
        label: label.trim(),
        href: href.trim(),
        group,
        role,
        active: true,
        visible: true,
      },
    ]);

    setLabel("");
    setHref("");
    setGroup("Workspace");
    setRole("All members");
    setIsCreateDialogOpen(false);
  }

  return (
    <AppShell
      activeNav="settings"
      breadcrumbs={[
        { label: "Settings", href: "/settings/menu" },
        { label: "Menu Settings" },
      ]}
      eyebrow="Configuration"
      title="Settings"
      toolbar={
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Menu settings</h2>
            <p className="text-sm text-muted-foreground">Create menu baru dan atur apakah menu tersebut aktif, nonaktif, terlihat, atau disembunyikan di bug tracker.</p>
          </div>
          <SettingsSubnav />
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Manage menus</CardTitle>
                  <CardDescription>List menu settings dalam format tabel. Menu yang di-set inactive akan otomatis hidden dari sidebar.</CardDescription>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger render={<Button />}>
                    <Plus />
                    Add Menu
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add new menu</DialogTitle>
                      <DialogDescription>Tambahkan menu baru untuk modul atau halaman custom di website bug tracker kamu.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="menu-label">Menu label</Label>
                        <Input id="menu-label" value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Contoh: Reports" />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="menu-href">Route</Label>
                        <Input id="menu-href" value={href} onChange={(event) => setHref(event.target.value)} placeholder="Contoh: /reports" />
                      </div>

                      <div className="grid gap-2">
                        <Label>Menu group</Label>
                        <Select value={group} onValueChange={(value) => setGroup(value ?? "Workspace")}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Workspace">Workspace</SelectItem>
                            <SelectItem value="Management">Management</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>Role access</Label>
                        <Select value={role} onValueChange={(value) => setRole(value ?? "All members")}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All members">All members</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Leads">Leads</SelectItem>
                            <SelectItem value="Admin only">Admin only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter showCloseButton>
                      <Button onClick={createMenu}>
                        <Plus />
                        Add menu
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
                    <TableHead>Menu</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMenus.length ? (
                    paginatedMenus.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.label}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.group}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.role}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.href}</TableCell>
                        <TableCell>
                          <Badge variant={item.active ? "secondary" : "outline"}>{item.active ? "Active" : "Inactive"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.visible ? "secondary" : "outline"}>{item.visible ? "Visible" : "Hidden"}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button onClick={() => toggleActive(item.id)} variant={item.active ? "destructive" : "default"} size="sm">
                              {item.active ? <PowerOff /> : <Power />}
                              {item.active ? "Set inactive" : "Set active"}
                            </Button>
                            <Button onClick={() => toggleVisibility(item.id)} variant="outline" size="sm" disabled={!item.active}>
                              {item.visible ? <EyeOff /> : <Eye />}
                              {item.visible ? "Hide menu" : "Show menu"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                        No menus found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedMenus.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(currentPage * PAGE_SIZE, menus.length)} of {menus.length} menus
                </p>
                <div className="flex items-center gap-2">
                  <Button disabled={currentPage === 1} onClick={() => setPage(1)} variant="outline" size="sm">
                    <ChevronsLeft />
                  </Button>
                  <Button disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} variant="outline" size="sm">
                    <ChevronLeft />
                  </Button>
                  <Badge variant="outline">{currentPage}</Badge>
                  <Button disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} variant="outline" size="sm">
                    <ChevronRight />
                  </Button>
                  <Button disabled={currentPage === totalPages} onClick={() => setPage(totalPages)} variant="outline" size="sm">
                    <ChevronsRight />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
