import type { Metadata } from "next";
import { TeamsPage } from "@/features/teams/components/teams-page";

export const metadata: Metadata = {
  title: "Teams",
};

export default function TeamsRoute() {
  return <TeamsPage />;
}
