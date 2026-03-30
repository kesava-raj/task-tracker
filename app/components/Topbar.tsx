"use client";
import React, { useMemo } from "react";
import { useAppStore } from "../store";

export const Topbar = () => {
  const { db, ui, setUi, setModals } = useAppStore();

  const inProj = ui.screen === "project";
  const project = inProj ? db.projects.find((p) => p.id === ui.pid) : null;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUi((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleFilterPri = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUi((prev) => ({ ...prev, fPri: e.target.value }));
  };

  const handleFilterAss = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUi((prev) => ({ ...prev, fAss: e.target.value }));
  };

  const assignees = db.assignees || [];

  return (
    <header id="topbar">
      <div className="tb-bc">
        {ui.screen === "home" && <span className="cur">Home</span>}
        {ui.screen === "mytasks" && (
          <>
            <span style={{ color: "var(--t3)" }}>Workspace</span>
            <span className="sep"> / </span>
            <span className="cur">My Tasks</span>
          </>
        )}
        {project && (
          <>
            <span style={{ color: "var(--t3)" }}>Projects</span>
            <span className="sep"> / </span>
            <span className="proj-dot" style={{ background: project.color }}></span>
            <span className="cur">{project.name}</span>
          </>
        )}
      </div>

      {inProj && <div className="tb-vr"></div>}

      {inProj && (
        <div className="view-tabs">
          <button
            className={`vtab ${ui.view === "board" ? "active" : ""}`}
            onClick={() => setUi((prev) => ({ ...prev, view: "board" }))}
          >
            ⊞ Board
          </button>
          <button
            className={`vtab ${ui.view === "list" ? "active" : ""}`}
            onClick={() => setUi((prev) => ({ ...prev, view: "list" }))}
          >
            ☰ List
          </button>
        </div>
      )}

      {inProj && (
        <div className="tb-search">
          <span className="si">⌕</span>
          <input
            type="text"
            placeholder="Search tasks…"
            value={ui.search}
            onChange={handleSearch}
          />
        </div>
      )}

      {inProj && (
        <div className="filter-grp">
          <div className="f-select">
            <select value={ui.fPri} onChange={handleFilterPri}>
              <option value="">Priority</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">⬇ Low</option>
            </select>
          </div>
          <div className="f-select">
            <select value={ui.fAss} onChange={handleFilterAss}>
              <option value="">Assignee</option>
              {assignees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {inProj && (
        <div className="tb-right" style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn-ghost"
            style={{ padding: "6px 12px", border: "1px solid var(--bdr)" }}
            onClick={() => setModals((m: any) => ({ ...m, proj: ui.pid }))}
            title="Edit Project Details"
          >
            ⚙️ Project Settings
          </button>
          <button
            className="btn-new"
            onClick={() => setModals((m: any) => ({ ...m, task: { open: true, editId: null, parentId: null, defaultStatus: null } }))}
          >
            ＋ New Task
          </button>
        </div>
      )}
    </header>
  );
};
