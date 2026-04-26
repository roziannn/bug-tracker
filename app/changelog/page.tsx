import type { Metadata } from "next";
import { ChangelogPage } from "@/features/changelog/components/changelog-page";

export const metadata: Metadata = {
  title: "Changelog",
};

export default function ChangelogRoute() {
  return <ChangelogPage />;
}
