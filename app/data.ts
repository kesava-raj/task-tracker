import { DB } from "./types";
import { uid } from "./utils";

export const createSeedData = (): DB => {
  const p1 = uid(), p2 = uid(), p3 = uid();
  const t1 = uid(), t2 = uid(), t3 = uid(), t4 = uid(), t5 = uid();
  const t6 = uid(), t7 = uid(), t8 = uid(), t9 = uid(), t10 = uid();
  const t11 = uid(), t12 = uid(), t13 = uid(), t14 = uid();

  return {
    projects: [
      { id: p1, name: "ClearBid", description: "E-Tendering & Bidding Platform", emoji: "🎯", color: "#6366f1", status: "active", owner: "Arjun K", startDate: "2026-03-01", dueDate: "2026-10-01", createdAt: "2026-03-01" },
      { id: p2, name: "Seragen", description: "Internal Banking System Suite", emoji: "🏦", color: "#3b82f6", status: "active", owner: "Divya M", startDate: "2026-03-10", dueDate: "", createdAt: "2026-03-10" },
      { id: p3, name: "MyProBuddy", description: "Internal tooling & workspace", emoji: "🚀", color: "#10b981", status: "completed", owner: "Priya S", startDate: "2026-03-20", dueDate: "2026-04-01", createdAt: "2026-03-20" },
    ],
    assignees: ["Arjun K", "Priya S", "Karthik R", "Divya M"],
    tasks: [
      { id: t1, projectId: p1, parentTaskId: null, title: "UAT — User Acceptance Testing", description: "Full UAT cycle across all modules before production go-live.", assignee: "Arjun K", status: "inprogress", priority: "high", labels: ["uat"], startDate: "2026-03-15", dueDate: "2026-03-31", createdAt: "2026-03-01" },
      { id: t2, projectId: p1, parentTaskId: null, title: "Documentation Package", description: "All documentation deliverables.", assignee: "Priya S", status: "todo", priority: "medium", labels: ["docs"], startDate: "2026-04-01", dueDate: "2026-04-15", createdAt: "2026-03-01" },
      { id: t3, projectId: p1, parentTaskId: t2, title: "Technical Manual", description: "Developer & system architecture docs.", assignee: "Priya S", status: "todo", priority: "medium", labels: ["docs", "backend"], startDate: "2026-04-01", dueDate: "2026-04-10", createdAt: "2026-03-01" },
      { id: t4, projectId: p1, parentTaskId: t2, title: "User Manual", description: "End-user guide with screenshots.", assignee: "Priya S", status: "todo", priority: "low", labels: ["docs"], startDate: "2026-04-10", dueDate: "2026-04-15", createdAt: "2026-03-01" },
      { id: t5, projectId: p1, parentTaskId: null, title: "Production Deployment", description: "Go-live checklist, deployment runbook, rollback plan.", assignee: "Arjun K", status: "todo", priority: "urgent", labels: ["backend"], startDate: "2026-04-16", dueDate: "2026-04-20", createdAt: "2026-03-01" },
      { id: t6, projectId: p2, parentTaskId: null, title: "SIA — System Integration Analysis", description: "Analyse all integration points between Seragen modules.", assignee: "Karthik R", status: "inprogress", priority: "high", labels: ["backend", "research"], startDate: "2026-03-10", dueDate: "2026-03-28", createdAt: "2026-03-10" },
      { id: t7, projectId: p2, parentTaskId: null, title: "SHA — Security Hardening Audit", description: "Complete security audit of all API endpoints.", assignee: "Karthik R", status: "done", priority: "urgent", labels: ["backend"], startDate: "2026-03-01", dueDate: "2026-03-20", createdAt: "2026-03-10" },
      { id: t8, projectId: p2, parentTaskId: null, title: "Documentation Suite", description: "Technical and user docs for Seragen.", assignee: "Divya M", status: "todo", priority: "medium", labels: ["docs"], startDate: "2026-04-01", dueDate: "2026-04-20", createdAt: "2026-03-10" },
      { id: t9, projectId: p2, parentTaskId: t8, title: "Technical Manual", description: "", assignee: "Divya M", status: "todo", priority: "medium", labels: ["docs", "backend"], startDate: "2026-04-01", dueDate: "2026-04-12", createdAt: "2026-03-10" },
      { id: t10, projectId: p2, parentTaskId: t8, title: "User Manual", description: "", assignee: "Divya M", status: "todo", priority: "low", labels: ["docs"], startDate: "2026-04-12", dueDate: "2026-04-20", createdAt: "2026-03-10" },
      { id: t11, projectId: p2, parentTaskId: null, title: "SWIFT Integration Module", description: "SWIFT messaging protocol integration layer.", assignee: "Arjun K", status: "inreview", priority: "high", labels: ["backend", "feature"], startDate: "2026-03-15", dueDate: "2026-04-05", createdAt: "2026-03-10" },
      { id: t12, projectId: p2, parentTaskId: null, title: "KIR — Key Integration Review", description: "Final review of all integration modules.", assignee: "Priya S", status: "todo", priority: "medium", labels: ["research"], startDate: "2026-04-01", dueDate: "2026-04-30", createdAt: "2026-03-10" },
      { id: t13, projectId: p2, parentTaskId: null, title: "Dashboard UI Redesign", description: "Redesign the main operational dashboard.", assignee: "Divya M", status: "todo", priority: "low", labels: ["design", "frontend"], startDate: "2026-04-10", dueDate: "2026-05-01", createdAt: "2026-03-10" },
      { id: t14, projectId: p3, parentTaskId: null, title: "Build Task Tracker v1", description: "Initial working prototype with board and list views.", assignee: "Arjun K", status: "done", priority: "high", labels: ["feature", "frontend"], startDate: "2026-03-20", dueDate: "2026-03-30", createdAt: "2026-03-20" },
    ],
    comments: [
      { id: uid(), taskId: t1, text: "Environment set up. Running smoke tests across all modules.", author: "Arjun K", ts: Date.now() - 86400000 },
      { id: uid(), taskId: t1, text: "Modules 1–3 UAT passed. Minor UI bugs logged. Moving to module 4.", author: "Arjun K", ts: Date.now() - 3600000 * 4 },
      { id: uid(), taskId: t7, text: "All critical findings resolved. Security audit signed off by team lead.", author: "Karthik R", ts: Date.now() - 172800000 },
      { id: uid(), taskId: t11, text: "Integration layer done, waiting for UAT clearance before merging.", author: "Arjun K", ts: Date.now() - 86400000 * 2 },
    ],
  };
};
