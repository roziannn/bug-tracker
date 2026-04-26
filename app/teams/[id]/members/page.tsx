import type { Metadata } from "next";
import { TeamMembersPage } from "@/features/teams/components/team-members-page";

export const metadata: Metadata = {
  title: "Team Members",
};

export default async function TeamMembersRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <TeamMembersPage id={id} />;
}
