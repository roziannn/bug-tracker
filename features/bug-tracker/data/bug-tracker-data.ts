export type Priority = "Critical" | "High" | "Medium" | "Low";
export type IssueStatus =
  | "Backlog"
  | "Ready"
  | "Investigating"
  | "In review"
  | "Done";

export type IssueRecord = {
  id: string;
  title: string;
  priority: Priority;
  status: IssueStatus;
  team: string;
  assignee: string;
  label: string | "None";
  createdAt: string;
  summary?: string;
};

export type OverviewCard = {
  label: string;
  value: string;
  note: string;
  icon:
    | "circle-dot"
    | "shield-alert"
    | "git-branch"
    | "sparkles";
};

export type KanbanColumn = {
  id: IssueStatus;
  title: string;
  description: string;
};

export type IssueClassification =
  | "UI Bug"
  | "Functional"
  | "Performance"
  | "Security"
  | "Data Integrity"
  | "Integration";

export type CriticalityTier = "Tier 1 - Critical" | "Tier 2 - Major" | "Tier 3 - Moderate" | "Tier 4 - Minor";

export type PicOption = {
  value: string;
  label: string;
  team: string;
};

export type ProjectOption = {
  value: string;
  label: string;
  squad: string;
};

export type TeamMetric = {
  id: string;
  name: string;
  lead: string;
  members: number;
  activeIssues: number;
  criticalOpen: number;
  sla: string;
};

export type ProjectMetric = {
  id: string;
  name: string;
  team: string;
  owner: string;
  status: "Healthy" | "At risk" | "Needs focus";
  openIssues: number;
  criticalIssues: number;
  nextMilestone: string;
};

export const overviewCards: OverviewCard[] = [
  { label: "Open bugs", value: "34", note: "+5 since yesterday", icon: "circle-dot" },
  { label: "Critical issues", value: "7", note: "2 need triage now", icon: "shield-alert" },
  { label: "In progress", value: "18", note: "Across 4 active sprints", icon: "git-branch" },
  { label: "Resolved this week", value: "29", note: "86% closed within SLA", icon: "sparkles" },
];

export const issues: IssueRecord[] = [
  {
    id: "BUG-218",
    title: "Crash when uploading screenshots larger than 10 MB",
    priority: "Critical",
    status: "In review",
    team: "Frontend",
    assignee: "RA",
    label: "Upload",
    createdAt: "2026-04-10",
    summary: "Attachment upload path fails when preview generation exceeds memory threshold.",
  },
  {
    id: "BUG-214",
    title: "Duplicate comments created after reconnecting offline session",
    priority: "High",
    status: "Investigating",
    team: "Platform",
    assignee: "MI",
    label: "None",
    createdAt: "2026-04-09",
    summary: "Queued requests replay twice after websocket reconnect in unstable networks.",
  },
  {
    id: "BUG-209",
    title: "Filter state resets after navigating back from issue detail",
    priority: "Medium",
    status: "Ready",
    team: "Frontend",
    assignee: "AL",
    label: "Navigation",
    createdAt: "2026-04-08",
    summary: "Search params are dropped when returning from detail page in app router flow.",
  },
  {
    id: "BUG-201",
    title: "Notification badge count mismatches unread total",
    priority: "Low",
    status: "Backlog",
    team: "Core",
    assignee: "DN",
    label: "None",
    createdAt: "2026-04-07",
    summary: "Unread aggregate is cached longer than individual stream counters.",
  },
  {
    id: "BUG-196",
    title: "Session timeout banner overlaps editor toolbar",
    priority: "High",
    status: "Done",
    team: "Frontend",
    assignee: "NV",
    label: "Editor",
    createdAt: "2026-04-05",
    summary: "Banner layer ignores sticky top offset in editor route.",
  },
  {
    id: "BUG-188",
    title: "Webhook delivery retries show inconsistent timestamps",
    priority: "Medium",
    status: "Done",
    team: "Platform",
    assignee: "KT",
    label: "Timezones",
    createdAt: "2026-04-04",
    summary: "Retry timeline mixes UTC and user locale formatting.",
  },
  {
    id: "BUG-224",
    title: "Mentions autocomplete stops responding after paste event",
    priority: "High",
    status: "Backlog",
    team: "Frontend",
    assignee: "SW",
    label: "Editor",
    createdAt: "2026-04-11",
    summary: "Editor parser loses caret anchor after multiline paste in comments.",
  },
  {
    id: "BUG-226",
    title: "Sentry release tag missing on rollback deployments",
    priority: "Medium",
    status: "Done",
    team: "Platform",
    assignee: "KT",
    label: "None",
    createdAt: "2026-04-11",
    summary: "Rollback pipeline publishes artifacts without final release marker.",
  },
  {
    id: "BUG-229",
    title: "CSV export includes hidden columns in compact table mode",
    priority: "Low",
    status: "Ready",
    team: "Core",
    assignee: "PR",
    label: "Export",
    createdAt: "2026-04-11",
    summary: "Export serializer ignores user-selected visible columns.",
  },
  {
    id: "BUG-231",
    title: "Critical blocker badge not synced to sprint summary",
    priority: "Critical",
    status: "Investigating",
    team: "Core",
    assignee: "LM",
    label: "Reports",
    createdAt: "2026-04-11",
    summary: "Summary service caches old blocker totals after issue escalation.",
  },
  {
    id: "BUG-233",
    title: "Audit log drawer truncates multiline stack traces",
    priority: "Medium",
    status: "In review",
    team: "Platform",
    assignee: "CY",
    label: "Audit",
    createdAt: "2026-04-10",
    summary: "Overflow styles collapse line breaks in trace output blocks.",
  },
  {
    id: "BUG-235",
    title: "Cannot reopen closed bug after release rollback",
    priority: "High",
    status: "Backlog",
    team: "Core",
    assignee: "AR",
    label: "Workflow",
    createdAt: "2026-04-11",
    summary: "State machine does not allow rollback transition from released to open.",
  },
];

export const kanbanColumns: KanbanColumn[] = [
  { id: "Backlog", title: "Backlog", description: "Reported issues waiting for prioritization." },
  { id: "Ready", title: "Ready", description: "Clear scope and ready to be picked up." },
  { id: "Investigating", title: "Investigating", description: "Engineers are reproducing and narrowing root cause." },
  { id: "In review", title: "In review", description: "Fixes are under QA or peer review." },
  { id: "Done", title: "Done", description: "Resolved items ready for release notes." },
];

export const issueClassifications: IssueClassification[] = [
  "UI Bug",
  "Functional",
  "Performance",
  "Security",
  "Data Integrity",
  "Integration",
];

export const criticalityTiers: CriticalityTier[] = [
  "Tier 1 - Critical",
  "Tier 2 - Major",
  "Tier 3 - Moderate",
  "Tier 4 - Minor",
];

export const picOptions: PicOption[] = [
  { value: "ra", label: "Raka Aditya", team: "Frontend" },
  { value: "mi", label: "Mira Indah", team: "Platform" },
  { value: "al", label: "Alif Latif", team: "Frontend" },
  { value: "dn", label: "Dina Nanda", team: "Core" },
  { value: "kt", label: "Kevin Tan", team: "Platform" },
  { value: "lm", label: "Laras Mahesa", team: "Core" },
];

export const projectOptions: ProjectOption[] = [
  { value: "bug-tracker-web", label: "Bug Tracker Web", squad: "Frontend" },
  { value: "triage-hub", label: "Triage Hub", squad: "Core" },
  { value: "incident-center", label: "Incident Center", squad: "Platform" },
  { value: "release-ops", label: "Release Ops", squad: "Core" },
];

export const teamMetrics: TeamMetric[] = [
  {
    id: "frontend",
    name: "Frontend",
    lead: "Raka Aditya",
    members: 8,
    activeIssues: 4,
    criticalOpen: 1,
    sla: "92%",
  },
  {
    id: "platform",
    name: "Platform",
    lead: "Mira Indah",
    members: 6,
    activeIssues: 4,
    criticalOpen: 0,
    sla: "95%",
  },
  {
    id: "core",
    name: "Core",
    lead: "Dina Nanda",
    members: 7,
    activeIssues: 4,
    criticalOpen: 1,
    sla: "88%",
  },
];

export const projectMetrics: ProjectMetric[] = [
  {
    id: "bug-tracker-web",
    name: "Bug Tracker Web",
    team: "Frontend",
    owner: "Raka Aditya",
    status: "At risk",
    openIssues: 9,
    criticalIssues: 1,
    nextMilestone: "UI stabilization - Apr 18",
  },
  {
    id: "triage-hub",
    name: "Triage Hub",
    team: "Core",
    owner: "Dina Nanda",
    status: "Healthy",
    openIssues: 6,
    criticalIssues: 0,
    nextMilestone: "Queue automation - Apr 21",
  },
  {
    id: "incident-center",
    name: "Incident Center",
    team: "Platform",
    owner: "Mira Indah",
    status: "Needs focus",
    openIssues: 8,
    criticalIssues: 2,
    nextMilestone: "Alert routing revamp - Apr 16",
  },
  {
    id: "release-ops",
    name: "Release Ops",
    team: "Core",
    owner: "Laras Mahesa",
    status: "Healthy",
    openIssues: 5,
    criticalIssues: 0,
    nextMilestone: "Rollback policy review - Apr 24",
  },
];

export function priorityVariant(
  priority: Priority
): "default" | "secondary" | "destructive" | "outline" {
  if (priority === "Critical") return "destructive";
  if (priority === "High") return "default";
  if (priority === "Medium") return "secondary";
  return "outline";
}

export function statusVariant(
  status: IssueStatus
): "default" | "secondary" | "outline" | "ghost" {
  if (status === "Ready") return "default";
  if (status === "In review") return "secondary";
  if (status === "Investigating") return "outline";
  return "ghost";
}

export function projectStatusVariant(
  status: ProjectMetric["status"]
): "default" | "secondary" | "destructive" {
  if (status === "Healthy") return "secondary";
  if (status === "At risk") return "default";
  return "destructive";
}
