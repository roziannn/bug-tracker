import type { Metadata } from "next";
import { CreateProjectPage } from "@/features/projects/components/create-project-page";

export const metadata: Metadata = {
  title: "Create Project",
};

export default function CreateProjectRoute() {
  return <CreateProjectPage />;
}
