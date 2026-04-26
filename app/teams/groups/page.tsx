import type { Metadata } from "next";
import { TeamGroupsPage } from "@/features/teams/components/team-groups-page";

export const metadata: Metadata = {
  title: "Group Teams",
};

export default function TeamGroupsRoute() {
  return <TeamGroupsPage />;
}
