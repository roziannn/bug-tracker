"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, MenuSquare, PanelLeft, Plus, Power, PowerOff, Smartphone } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [group, setGroup] = useState("Workspace");
  const [role, setRole] = useState("All members");

  const visibleCount = useMemo(() => menus.filter((item) => item.visible).length, [menus]);
  const activeCount = useMemo(() => menus.filter((item) => item.active).length, [menus]);

  function toggleVisibility(id: string) {
    setMenus((current) =>
      current.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  }

  function toggleActive(id: string) {
    setMenus((current) =>
      current.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
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
  }

  return (
    <AppShell
      activeNav="settings"
      eyebrow="Configuration"
      title="Settings"
      toolbar={
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Menu settings</h2>
            <p className="text-sm text-muted-foreground">
              Create menu baru dan atur apakah menu tersebut aktif, nonaktif, terlihat, atau disembunyikan di bug tracker.
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
                  <CardDescription>Total menus</CardDescription>
                  <CardTitle className="mt-2 text-3xl">{menus.length}</CardTitle>
                </div>
                <MenuSquare className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Jumlah seluruh menu yang saat ini terdaftar di sidebar workspace.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Active menus</CardDescription>
                  <CardTitle className="mt-2 text-3xl">{activeCount}</CardTitle>
                </div>
                <PanelLeft className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Menu aktif masih bisa disembunyikan kalau `visible` dimatikan.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Visible menus</CardDescription>
                  <CardTitle className="mt-2 text-3xl">{visibleCount}</CardTitle>
                </div>
                <Smartphone className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Menu visible akan muncul di UI sidebar desktop dan mobile.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Create menu</CardTitle>
              <CardDescription>
                Tambahkan menu baru untuk modul atau halaman custom di website bug tracker kamu.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="menu-label">Menu label</Label>
                <Input
                  id="menu-label"
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  placeholder="Contoh: Reports"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="menu-href">Route</Label>
                <Input
                  id="menu-href"
                  value={href}
                  onChange={(event) => setHref(event.target.value)}
                  placeholder="Contoh: /reports"
                />
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

              <Button onClick={createMenu}>
                <Plus />
                Create menu
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage menus</CardTitle>
              <CardDescription>
                Toggle status aktif dan visibilitas tiap menu secara langsung dari halaman settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {menus.map((item) => (
                <div key={item.id} className="rounded-xl border p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{item.label}</p>
                        <Badge variant="outline">{item.group}</Badge>
                        <Badge variant="outline">{item.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.href}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={item.active ? "secondary" : "outline"}>
                        {item.active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant={item.visible ? "secondary" : "outline"}>
                        {item.visible ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      onClick={() => toggleActive(item.id)}
                      variant={item.active ? "destructive" : "default"}
                    >
                      {item.active ? <PowerOff /> : <Power />}
                      {item.active ? "Set inactive" : "Set active"}
                    </Button>
                    <Button
                      onClick={() => toggleVisibility(item.id)}
                      variant="outline"
                    >
                      {item.visible ? <EyeOff /> : <Eye />}
                      {item.visible ? "Hide menu" : "Show menu"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
