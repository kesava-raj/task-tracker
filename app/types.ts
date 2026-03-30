export type Status = "todo" | "inprogress" | "inreview" | "done" | "cancelled";
export type Priority = "urgent" | "high" | "medium" | "low" | "none";

export interface Project {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  status: "active" | "onhold" | "completed";
  owner: string;
  startDate: string;
  dueDate: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  projectId: string;
  parentTaskId: string | null;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  labels: string[];
  startDate: string;
  dueDate: string;
  createdAt?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  text: string;
  author: string;
  ts: number;
}

export interface DB {
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  assignees: string[];
}

export interface UIState {
  screen: "home" | "mytasks" | "project";
  pid: string | null;
  view: "board" | "list";
  search: string;
  fPri: string;
  fAss: string;
}

export const STATUSES: { id: Status; label: string; icon: string; color: string }[] = [
  { id: "todo", label: "Todo", icon: "○", color: "#9ca3af" },
  { id: "inprogress", label: "In Progress", icon: "◑", color: "#3b82f6" },
  { id: "inreview", label: "In Review", icon: "◆", color: "#8b5cf6" },
  { id: "done", label: "Done", icon: "✓", color: "#10b981" },
  { id: "cancelled", label: "Cancelled", icon: "✕", color: "#ef4444" },
];
export const ST = Object.fromEntries(STATUSES.map((s) => [s.id, s]));

export const PRIORITIES: { id: Priority; label: string; icon: string; color: string }[] = [
  { id: "urgent", label: "Urgent", icon: "🔴", color: "#ef4444" },
  { id: "high", label: "High", icon: "🟠", color: "#f97316" },
  { id: "medium", label: "Medium", icon: "🟡", color: "#eab308" },
  { id: "low", label: "Low", icon: "⬇", color: "#94a3b8" },
  { id: "none", label: "None", icon: "–", color: "#d1d5db" },
];
export const PRI = Object.fromEntries(PRIORITIES.map((p) => [p.id, p]));

export const LABELS = [
  { id: "bug", label: "Bug", bg: "#fee2e2", color: "#dc2626" },
  { id: "feature", label: "Feature", bg: "#dbeafe", color: "#1d4ed8" },
  { id: "design", label: "Design", bg: "#f3e8ff", color: "#7c3aed" },
  { id: "backend", label: "Backend", bg: "#dcfce7", color: "#166534" },
  { id: "frontend", label: "Frontend", bg: "#fef9c3", color: "#854d0e" },
  { id: "uat", label: "UAT", bg: "#e0f2fe", color: "#0369a1" },
  { id: "docs", label: "Docs", bg: "#fff7ed", color: "#c2410c" },
  { id: "research", label: "Research", bg: "#ffe4e6", color: "#be123c" },
];
export const LAB = Object.fromEntries(LABELS.map((l) => [l.id, l]));

export const EMOJIS = ["🚀", "💡", "🎯", "🛠", "📊", "🌐", "⚡", "🔧", "📱", "🎨", "🔬", "📝", "🏗", "🌟", "💼", "🔐", "🧩", "🤖", "🌿", "⚙️", "📦", "🔮", "🌊", "🎪", "🏆", "💎", "🔔", "📡", "🧪", "🎭"];
export const COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#84cc16", "#a855f7"];
export const AV_COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#84cc16"];
