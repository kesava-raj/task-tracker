"use client";
import React from "react";
import { useAppStore } from "../store";
import { STATUSES, PRI } from "../types";
import { isOv, fmtDate, Avatar } from "../utils";

export const MyTasksView = () => {
  const { db, setUi, expandedGroups, setExpandedGroups, setPanelTaskId } = useAppStore();

  const tasks = db.tasks.filter((t) => !t.parentTaskId && t.status !== "done" && t.status !== "cancelled");

  if (!tasks.length) {
    return (
      <div className="empty-state">
        <div className="ei">✅</div>
        <h3>You're all caught up!</h3>
        <p>No open tasks across all projects.</p>
      </div>
    );
  }

  const grouped: Record<string, typeof tasks> = {};
  STATUSES.filter((s) => s.id !== "done" && s.id !== "cancelled").forEach((s) => {
    grouped[s.id] = tasks.filter((t) => t.status === s.id);
  });

  const handleToggleGroup = (id: string) => {
    const newExp = new Set(expandedGroups);
    if (newExp.has(id)) newExp.delete(id);
    else newExp.add(id);
    setExpandedGroups(newExp);
  };

  const handleSelectProject = (pid: string, tid: string) => {
    setUi((prev) => ({ ...prev, screen: "project", pid, view: "board", search: "", fPri: "", fAss: "" }));
    setTimeout(() => setPanelTaskId(tid), 100);
  };

  return (
    <div className="list-wrap">
      {STATUSES.filter((s) => s.id !== "done" && s.id !== "cancelled").map((s) => {
        const grpTasks = grouped[s.id];
        const gid = `mt-${s.id}`;
        const isOpen = expandedGroups.has(gid) || grpTasks.length > 0;

        return (
          <div key={s.id} className="list-group">
            <div className="group-header" onClick={() => handleToggleGroup(gid)}>
              <span className={`gh-arrow ${isOpen ? "open" : ""}`}>▶</span>
              <span className="gh-dot" style={{ background: s.color }}></span>
              <span className="gh-name">{s.label}</span>
              <span className="gh-cnt">{grpTasks.length}</span>
            </div>

            {isOpen && (
              <div className="list-cols-hd">
                <span>Task</span>
                <span>Project</span>
                <span>Assignee</span>
                <span>Due Date</span>
                <span>Priority</span>
                <span></span>
              </div>
            )}

            {isOpen &&
              grpTasks.map((t) => {
                const p = db.projects.find((proj) => proj.id === t.projectId);
                const ov = isOv(t.dueDate);
                const P = PRI[t.priority || "none"];

                return (
                  <div
                    key={t.id}
                    className="list-row"
                    onClick={() => handleSelectProject(t.projectId, t.id)}
                  >
                    <div className="lr-name">
                      <span className="lr-status-ico" style={{ color: s.color }}>{s.icon}</span>
                      <span className="lr-title">{t.title}</span>
                    </div>

                    <div style={{ fontSize: "11px", color: "var(--t3)", fontWeight: 500 }}>
                      {p ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span>{p.emoji}</span>
                          {p.name}
                        </span>
                      ) : (
                        "—"
                      )}
                    </div>

                    <div className="lr-assign">
                      {t.assignee ? (
                        <>
                          <Avatar name={t.assignee} size={18} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {t.assignee}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: "var(--t4)" }}>—</span>
                      )}
                    </div>

                    <div className={`lr-date ${ov ? "overdue" : ""}`}>
                      {fmtDate(t.dueDate) || "—"}
                    </div>

                    <div>
                      {P.id !== "none" ? (
                        <span style={{ fontSize: "11px", fontWeight: 700, color: P.color }}>
                          {P.icon} {P.label}
                        </span>
                      ) : (
                        <span style={{ color: "var(--t4)" }}>—</span>
                      )}
                    </div>

                    <div></div>
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
};
