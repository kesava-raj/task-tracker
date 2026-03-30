"use client";
import React from "react";
import { useAppStore } from "../store";
import { STATUSES, ST, PRI, LAB } from "../types";
import { Avatar, isOv, fmtDate } from "../utils";

export const ListView = () => {
  const { db, ui, updateDb, expandedGroups, setExpandedGroups, expandedRows, setExpandedRows, setPanelTaskId, setModals } = useAppStore();

  const getFiltered = () => {
    return db.tasks.filter((t) => {
      if (t.projectId !== ui.pid || t.parentTaskId) return false;
      if (ui.fPri && t.priority !== ui.fPri) return false;
      if (ui.fAss && t.assignee !== ui.fAss) return false;
      if (ui.search && !t.title.toLowerCase().includes(ui.search.toLowerCase())) return false;
      return true;
    });
  };

  const tasks = getFiltered();

  const handleToggleGroup = (id: string) => {
    const newExp = new Set(expandedGroups);
    if (newExp.has(id)) newExp.delete(id);
    else newExp.add(id);
    setExpandedGroups(newExp);
  };

  const handleToggleRow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newExp = new Set(expandedRows);
    if (newExp.has(id)) newExp.delete(id);
    else newExp.add(id);
    setExpandedRows(newExp);
  };

  const cycleStatus = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const i = db.tasks.findIndex((t) => t.id === id);
    if (i > -1) {
      const t = db.tasks[i];
      const sIndex = STATUSES.findIndex((s) => s.id === t.status);
      const nextStatus = STATUSES[(sIndex + 1) % STATUSES.length].id;

      const newTasks = [...db.tasks];
      newTasks[i] = { ...t, status: nextStatus as any };
      updateDb({ ...db, tasks: newTasks });
    }
  };

  const renderRow = (t: any, isSub: boolean) => {
    const subs = !isSub ? db.tasks.filter((sub) => sub.parentTaskId === t.id) : [];
    const exp = expandedRows.has(t.id);
    const ov = isOv(t.dueDate) && t.status !== "done" && t.status !== "cancelled";
    const s = ST[t.status];
    const P = PRI[t.priority || "none"];

    return (
      <React.Fragment key={t.id}>
        <div className={`list-row ${isSub ? "sub-row" : ""}`} onClick={() => setPanelTaskId(t.id)}>
          <div className="lr-name">
            {!isSub && subs.length > 0 ? (
              <button className="lr-expand" onClick={(e) => handleToggleRow(e, t.id)}>
                {exp ? "▾" : "▸"}
              </button>
            ) : (
              <span style={{ width: "18px", display: "inline-block" }}></span>
            )}
            <span
              className="lr-status-ico"
              style={{ color: s.color }}
              onClick={(e) => cycleStatus(e, t.id)}
              title="Click to advance status"
            >
              {s.icon}
            </span>
            <span className="lr-pri-ico" style={{ color: P.color }}>
              {P.id !== "none" ? P.icon : ""}
            </span>
            <span className={`lr-title ${t.status === "done" ? "done-s" : ""}`}>{t.title}</span>
            {subs.length > 0 && !isSub && <span className="lr-sub-cnt">⊢{subs.length}</span>}
          </div>

          <div className="lr-assign">
            {t.assignee ? (
              <>
                <Avatar name={t.assignee} size={18} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.assignee}</span>
              </>
            ) : (
              <span style={{ color: "var(--t4)" }}>—</span>
            )}
          </div>

          <div className={`lr-date ${ov ? "overdue" : ""}`}>{fmtDate(t.dueDate) || "—"}</div>

          <div>
            {P.id !== "none" ? (
              <span style={{ fontSize: "11px", fontWeight: 700, color: P.color }}>
                {P.icon} {P.label}
              </span>
            ) : (
              <span style={{ color: "var(--t4)" }}>—</span>
            )}
          </div>

          <div className="lr-labs">
            {(t.labels || []).map((lid: string) => {
              const L = LAB[lid];
              if (!L) return null;
              return (
                <span key={lid} className="lab-chip" style={{ background: L.bg, color: L.color }}>
                  {L.label}
                </span>
              );
            })}
          </div>

          <div className="lr-acts" onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn" onClick={() => setModals((m: any) => ({ ...m, task: { open: true, editId: t.id, parentId: null, defaultStatus: null } }))} title="Edit">
              ✎
            </button>
            <button className="icon-btn del" onClick={() => setModals((m: any) => ({ ...m, confirm: { open: true, type: "task", id: t.id } }))} title="Delete">
              ✕
            </button>
          </div>
        </div>
        {exp && !isSub && subs.map((sub) => renderRow(sub, true))}
      </React.Fragment>
    );
  };

  return (
    <div className="list-wrap">
      {STATUSES.map((s) => {
        const sectTasks = tasks.filter((t) => t.status === s.id);
        const isOpen = expandedGroups.has(s.id);

        return (
          <div key={s.id} className="list-group">
            <div className="group-header" onClick={() => handleToggleGroup(s.id)}>
              <span className={`gh-arrow ${isOpen ? "open" : ""}`}>▶</span>
              <span className="gh-dot" style={{ background: s.color }}></span>
              <span className="gh-name">{s.label}</span>
              <span className="gh-cnt">{sectTasks.length}</span>
              <button
                className="gh-addbtn"
                onClick={(e) => {
                  e.stopPropagation();
                  setModals((m: any) => ({ ...m, task: { open: true, editId: null, parentId: null, defaultStatus: s.id } }));
                }}
              >
                +
              </button>
            </div>

            {isOpen && (
              <div className="list-cols-hd">
                <span>Task</span>
                <span>Assignee</span>
                <span>Due Date</span>
                <span>Priority</span>
                <span>Labels</span>
                <span></span>
              </div>
            )}

            {isOpen && (
              <>
                {sectTasks.map((t) => renderRow(t, false))}
                <div
                  className="add-task-row"
                  onClick={() => setModals((m: any) => ({ ...m, task: { open: true, editId: null, parentId: null, defaultStatus: s.id } }))}
                >
                  ＋ Add task
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
