import type { Metadata } from "next";
import { CreateIssuePage } from "@/features/issues/components/create-issue-page";

export const metadata: Metadata = {
  title: "Create Issue",
};

export default function CreateIssue() {
  return <CreateIssuePage />;
}
