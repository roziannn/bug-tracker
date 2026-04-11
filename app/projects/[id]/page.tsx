import { ProjectDetailPage } from "@/features/projects/components/project-detail-page";

export default async function ProjectDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProjectDetailPage id={id} />;
}
