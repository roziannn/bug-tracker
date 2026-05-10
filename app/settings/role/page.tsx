import type { Metadata } from "next";
import { PermissionSettingsPage } from "@/features/settings/components/permission-settings-page";

export const metadata: Metadata = {
  title: "Role Settings",
};

export default function SettingsRolePage() {
  return <PermissionSettingsPage mode="role" />;
}
