"use client";
import React from "react";
import { useAppStore } from "../store";
import { STATUSES } from "../types";

export const HomeView = () => {
  const { db, setUi, setModals } = useAppStore();

  const allTasks = db.tasks.filter((t) => !t.parentTaskId);
  const doneCount = allTasks.filter((t) => t.status === "done").length;
  const inprogCount = allTasks.filter((t) => t.status === "inprogress").length;
  const overdueCount = allTasks.filter(
    (t) => !!(t.dueDate && t.dueDate < new Date().toISOString().slice(0, 10)) && t.status !== "done" && t.status !== "cancelled"
  ).length;

  const handleSelectProject = (id: string) => {
    setUi((prev) => ({ ...prev, screen: "project", pid: id, view: "board", search: "", fPri: "", fAss: "" }));
  };

  return (
    <div className="home-wrap">
      <div className="home-greet">👋 Good day, Team!</div>
      <div className="home-sub">Here's what's happening across your workspace.</div>

      <div className="stats-row">
        <div className="stat-card accent">
          <div className="sv">{db.projects.length}</div>
          <div className="sl">Projects</div>
        </div>
        <div className="stat-card">
          <div className="sv">{allTasks.length}</div>
          <div className="sl">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="sv" style={{ color: "#3b82f6" }}>{inprogCount}</div>
          <div className="sl">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="sv" style={{ color: "#10b981" }}>{doneCount}</div>
          <div className="sl">Completed</div>
        </div>
        {overdueCount > 0 && (
          <div className="stat-card">
            <div className="sv" style={{ color: "#ef4444" }}>{overdueCount}</div>
            <div className="sl">Overdue</div>
          </div>
        )}
      </div>

      <div className="sec-title">All Projects</div>
      <div className="proj-grid">
        {db.projects.map((p) => {
          const tasks = db.tasks.filter((t) => t.projectId === p.id && !t.parentTaskId);
          const doneC = tasks.filter((t) => t.status === "done").length;
          const pct = tasks.length ? Math.round((doneC / tasks.length) * 100) : 0;
          
          const statusCounts: Record<string, number> = {};
          STATUSES.forEach((s) => {
            statusCounts[s.id] = tasks.filter((t) => t.status === s.id).length;
          });

          return (
            <div
              key={p.id}
              className="proj-card"
              style={{ "--pc": p.color } as React.CSSProperties}
              onClick={() => handleSelectProject(p.id)}
            >
              <div className="pc-hd">
                <div className="pc-ico">{p.emoji}</div>
                <div>
                  <div className="pc-name">{p.name}</div>
                  <div className="pc-desc">{p.description || "No description"}</div>
                </div>
              </div>
              
              <div className="pc-prog">
                <div className="pc-pbar">
                  <div className="pc-pfill" style={{ width: `${pct}%`, background: p.color }}></div>
                </div>
                <div className="pc-plabel">
                  <span>{doneC}/{tasks.length} done</span>
                  <span>{pct}%</span>
                </div>
              </div>

              <div className="pc-stats">
                {STATUSES.filter((s) => statusCounts[s.id] > 0).map((s) => (
                  <span key={s.id} className="pc-st">
                    <span className="pc-dot" style={{ background: s.color }}></span>
                    {statusCounts[s.id]} {s.label}
                  </span>
                ))}
                {!tasks.length && <span style={{ fontSize: "10px", color: "var(--t4)" }}>No tasks</span>}
              </div>
            </div>
          );
        })}

        <div className="add-proj-card" onClick={() => setModals((m: any) => ({ ...m, proj: true }))}>
          <div className="ai">＋</div>
          New Project
        </div>
      </div>
    </div>
  );
};
