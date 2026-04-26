import type { Metadata } from "next";
import { EnvironmentSettingsPage } from "@/features/settings/components/environment-settings-page";

export const metadata: Metadata = {
  title: "Environment Settings",
};

export default function SettingsEnvironmentPage() {
  return <EnvironmentSettingsPage />;
}
