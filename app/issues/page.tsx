import type { Metadata } from "next";
import { AllIssuesPage } from "@/features/issues/components/all-issues-page";

export const metadata: Metadata = {
  title: "All Issues",
};

export default function IssuesRoute() {
  return <AllIssuesPage />;
}
