import type { Metadata } from "next";
import { KanbanBoard } from "@/features/kanban/components/kanban-board";

export const metadata: Metadata = {
  title: "Kanban",
};

export default function KanbanPage() {
  return <KanbanBoard />;
}
