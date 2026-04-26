import type { Metadata } from "next";
import { IssueDetailPage } from "@/features/issues/components/issue-detail-page";

export const metadata: Metadata = {
  title: "Issue Detail",
};

export default async function IssueDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <IssueDetailPage id={id} />;
}
