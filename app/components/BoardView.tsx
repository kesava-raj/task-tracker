"use client";
import React from "react";
import { useAppStore } from "../store";
import { STATUSES, PRI } from "../types";
import { Avatar, isOv, fmtDate } from "../utils";

export const BoardView = () => {
  const { db, ui, setPanelTaskId, dragId, setDragId, updateDb, setModals } = useAppStore();

  const allFiltered = db.tasks.filter((t) => {
    if (t.projectId !== ui.pid) return false;
    if (ui.fPri && t.priority !== ui.fPri) return false;
    if (ui.fAss && t.assignee !== ui.fAss) return false;
    if (ui.search && !t.title.toLowerCase().includes(ui.search.toLowerCase())) return false;
    return true;
  });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.currentTarget.classList.remove("drag-over");
    if (!dragId) return;

    const taskIndex = db.tasks.findIndex((t) => t.id === dragId);
    if (taskIndex > -1) {
      const newTasks = [...db.tasks];
      newTasks[taskIndex] = { ...newTasks[taskIndex], status: status as any };
      updateDb({ ...db, tasks: newTasks });
    }
    setDragId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("drag-over");
  };

  return (
    <div className="board-wrap">
      {STATUSES.map((s) => {
        // const cards = allFiltered.filter((t) => t.status === s.id && !t.parentTaskId);
        // Wait, the vanilla JS didn't filter out parentTaskId for cards in board view (it rendered subtasks as cards too).
        // The HTML script: `const cards = allFiltered.filter(t=>t.status===s.id);`

        const allCards = allFiltered.filter((t) => t.status === s.id);

        return (
          <div key={s.id} className="board-col">
            <div className="col-header">
              <span className="col-status-dot" style={{ background: s.color }}></span>
              <span className="col-name">{s.label}</span>
              <span className="col-count">{allCards.length}</span>
              <button
                className="col-add-btn"
                onClick={() => setModals((m: any) => ({ ...m, task: { open: true, editId: null, parentId: null, defaultStatus: s.id } }))}
              >
                +
              </button>
            </div>
            <div
              className="col-body"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, s.id)}
            >
              {allCards.length > 0 ? (
                allCards.map((t) => {
                  const subs = db.tasks.filter((sub) => sub.parentTaskId === t.id);
                  const par = t.parentTaskId ? db.tasks.find((p) => p.id === t.parentTaskId) : null;
                  const ov = isOv(t.dueDate) && t.status !== "done" && t.status !== "cancelled";

                  return (
                    <div
                      key={t.id}
                      className={`task-card ${t.parentTaskId ? "is-sub" : ""}`}
                      data-pri={t.priority || "none"}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, t.id)}
                      onClick={() => setPanelTaskId(t.id)}
                    >
                      {par && <div className="tc-parent">↳ {par.title}</div>}
                      <div className={`tc-title ${t.status === "done" ? "done-s" : ""}`}>{t.title}</div>

                      {t.labels && t.labels.length > 0 && (
                        <div className="tc-labs">
                          {t.labels.map((lid) => {
                            const L = require("../types").LAB[lid];
                            if (!L) return null;
                            return (
                              <span key={lid} className="lab-chip" style={{ background: L.bg, color: L.color }}>
                                {L.label}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <div className="tc-footer">
                        {t.priority !== "none" && PRI[t.priority] && (
                          <span className="tc-pri" style={{ color: PRI[t.priority].color }} title={PRI[t.priority].label}>
                            {PRI[t.priority].icon}
                          </span>
                        )}
                        {subs.length > 0 && <span className="tc-subs">⊢{subs.length}</span>}
                        <span className="tc-space"></span>
                        {t.dueDate && (
                          <span className={`tc-date ${ov ? "overdue" : ""}`}>📅{fmtDate(t.dueDate)}</span>
                        )}
                        <Avatar name={t.assignee} size={20} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-empty">Drop tasks here</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
