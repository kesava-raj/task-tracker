"use client";
import React from "react";
import { useAppStore } from "../store";

export const Sidebar = () => {
  const { db, ui, setUi, setModals } = useAppStore();

  const handleGoHome = () => {
    setUi((prev) => ({ ...prev, screen: "home", pid: null }));
  };

  const handleGoMyTasks = () => {
    setUi((prev) => ({ ...prev, screen: "mytasks", pid: null }));
  };

  const handleSelectProject = (id: string) => {
    setUi((prev) => ({ ...prev, screen: "project", pid: id, view: "board", search: "", fPri: "", fAss: "" }));
  };

  const mtCnt = db.tasks.filter((t) => !t.parentTaskId && t.status !== "done" && t.status !== "cancelled").length;

  return (
    <aside id="sidebar">
      <div className="sb-header" style={{ padding: "16px 20px" }}>
        <img src="/logo.png" alt="Logo" style={{ width: "32px", height: "32px", objectFit: "contain", marginRight: "12px", borderRadius: "6px" }} />
        <span className="sb-title">MyProBuddy</span>
        <span className="sb-badge">Workspace</span>
      </div>

      <div className="sb-nav">
        <div className={`sb-item ${ui.screen === "home" ? "active" : ""}`} onClick={handleGoHome}>
          <span className="ico">⌂</span>Home
        </div>
        <div className={`sb-item ${ui.screen === "mytasks" ? "active" : ""}`} onClick={handleGoMyTasks}>
          <span className="ico">✓</span>My Tasks
          <span className="cnt">{mtCnt}</span>
        </div>
        <div className="sb-item" onClick={() => setModals((m: any) => ({ ...m, assignees: true }))}>
          <span className="ico">👥</span>Manage Team
        </div>
      </div>

      <div className="sb-sep"></div>

      <div className="sb-section-hd">
        Projects
        <button
          className="sb-add-btn"
          onClick={() => setModals((m: any) => ({ ...m, proj: true }))}
          title="New Project"
        >
          +
        </button>
      </div>

      <div className="sb-projects">
        {db.projects.length === 0 ? (
          <div style={{ padding: "6px 12px", fontSize: "11px", color: "#3d4357", fontWeight: 500 }}>No projects yet</div>
        ) : (
          db.projects.map((p) => {
            const cnt = db.tasks.filter((t) => t.projectId === p.id && !t.parentTaskId).length;
            const isActive = ui.pid === p.id && ui.screen === "project";
            return (
              <div
                key={p.id}
                className={`sb-proj ${isActive ? "active" : ""}`}
                onClick={() => handleSelectProject(p.id)}
              >
                <span className="pemoji" style={{ background: `${p.color}22` }}>{p.emoji}</span>
                <span className="pname">{p.name}</span>
                <span className="ptc">{cnt}</span>
                <span className="sb-proj-acts" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setModals((m: any) => ({ ...m, proj: p.id }))} title="Edit">✎</button>
                  <button
                    className="delbtn"
                    onClick={() => setModals((m: any) => ({ ...m, confirm: { open: true, type: "project", id: p.id } }))}
                    title="Delete"
                  >
                    ✕
                  </button>
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="sb-footer">
        <div className="sb-footer-item" onClick={() => setModals((m: any) => ({ ...m, proj: true }))}>
          <span style={{ fontSize: "14px" }}>+</span> New Project
        </div>
      </div>
    </aside>
  );
};
