"use client";
import React, { useState, useEffect } from "react";
import { useAppStore } from "../store";
import { STATUSES, PRIORITIES, LABELS, ST } from "../types";
import { Avatar, fmtTs, uid } from "../utils";

export const RightPanel = () => {
  const { db, updateDb, panelTaskId, setPanelTaskId, setModals } = useAppStore();
  const [localTitle, setLocalTitle] = useState("");
  const [localAssignee, setLocalAssignee] = useState("");
  const [localStart, setLocalStart] = useState("");
  const [localDue, setLocalDue] = useState("");
  const [localDesc, setLocalDesc] = useState("");
  const [commentTxt, setCommentTxt] = useState("");
  const [commentWho, setCommentWho] = useState("");
  const [savedVisual, setSavedVisual] = useState(false);

  const t = panelTaskId ? db.tasks.find((task) => task.id === panelTaskId) : null;
  const p = t ? db.projects.find((proj) => proj.id === t.projectId) : null;
  const par = t && t.parentTaskId ? db.tasks.find((task) => task.id === t.parentTaskId) : null;

  useEffect(() => {
    if (t) {
      setLocalTitle(t.title || "");
      setLocalAssignee(t.assignee || "");
      setLocalStart(t.startDate || "");
      setLocalDue(t.dueDate || "");
      setLocalDesc(t.description || "");
    }
  }, [t]);

  if (!t || !p) return null;

  const subs = db.tasks.filter((sub) => sub.parentTaskId === t.id);
  const coms = db.comments.filter((c) => c.taskId === t.id);

  const setStatus = (s: string) => {
    const newTasks = [...db.tasks];
    const index = newTasks.findIndex((x) => x.id === t.id);
    newTasks[index] = { ...newTasks[index], status: s as any };
    updateDb({ ...db, tasks: newTasks });
  };

  const setPri = (pri: string) => {
    const newTasks = [...db.tasks];
    const index = newTasks.findIndex((x) => x.id === t.id);
    newTasks[index] = { ...newTasks[index], priority: pri as any };
    updateDb({ ...db, tasks: newTasks });
  };

  const toggleLabel = (lid: string) => {
    const newTasks = [...db.tasks];
    const index = newTasks.findIndex((x) => x.id === t.id);
    const labels = [...(newTasks[index].labels || [])];
    if (labels.includes(lid)) {
      labels.splice(labels.indexOf(lid), 1);
    } else {
      labels.push(lid);
    }
    newTasks[index] = { ...newTasks[index], labels };
    updateDb({ ...db, tasks: newTasks });
  };

  const handleSave = () => {
    const newTasks = [...db.tasks];
    const index = newTasks.findIndex((x) => x.id === t.id);
    newTasks[index] = {
      ...newTasks[index],
      title: localTitle.trim() || t.title,
      assignee: localAssignee.trim(),
      startDate: localStart,
      dueDate: localDue,
      description: localDesc.trim(),
    };
    updateDb({ ...db, tasks: newTasks });

    setSavedVisual(true);
    setTimeout(() => setSavedVisual(false), 1800);
  };

  const handleDelete = () => {
    setModals((m: any) => ({ ...m, confirm: { open: true, type: "task", id: t.id } }));
  };

  const handlePostComment = () => {
    if (!commentTxt.trim()) return;
    const author = commentWho.trim() || "Anonymous";
    const newComment = {
      id: uid(),
      taskId: t.id,
      text: commentTxt.trim(),
      author,
      ts: Date.now(),
    };
    updateDb({ ...db, comments: [...db.comments, newComment] });
    setCommentTxt("");
  };

  return (
    <div id="panel" className={panelTaskId ? "open" : ""}>
      <div className="panel-header">
        <button className="panel-back" onClick={() => setPanelTaskId(null)}>←</button>
        <span className="panel-proj-tag">
          {p.emoji} {p.name}
        </span>
        {par && (
          <span className="panel-parent-tag">↳ {par.title}</span>
        )}
        <div className="panel-hacts">
          <button className="icon-btn del" onClick={handleDelete} title="Delete task" style={{ fontSize: "15px" }}>🗑</button>
        </div>
      </div>

      <div className="panel-body">
        <div className="ps-title">
          <textarea
            className="ps-title-input"
            rows={2}
            spellCheck="false"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
          />
        </div>

        <div className="ps-status">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              className={`status-pill ${s.id} ${t.status === s.id ? "sel" : ""}`}
              onClick={() => setStatus(s.id)}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div className="ps-fields">
          <div className="pf">
            <div className="pf-label">Priority</div>
            <div className="pri-pills">
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  className={`pri-pill ${(t.priority || "none") === p.id ? "sel" : ""}`}
                  data-p={p.id}
                  onClick={() => setPri(p.id)}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="pf">
            <div className="pf-label">Assignee</div>
            <select
              className="pf-input"
              value={localAssignee}
              onChange={(e) => setLocalAssignee(e.target.value)}
            >
              <option value="">Unassigned</option>
              {(db.assignees || []).map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="pf">
            <div className="pf-label">Start Date</div>
            <input
              className="pf-input"
              type="date"
              value={localStart}
              onChange={(e) => setLocalStart(e.target.value)}
            />
          </div>
          <div className="pf">
            <div className="pf-label">Due Date</div>
            <input
              className="pf-input"
              type="date"
              value={localDue}
              onChange={(e) => setLocalDue(e.target.value)}
            />
          </div>
          <div className="pf full">
            <div className="pf-label">Description</div>
            <textarea
              className="pf-input"
              rows={3}
              style={{ resize: "vertical" }}
              value={localDesc}
              onChange={(e) => setLocalDesc(e.target.value)}
            />
          </div>
        </div>

        <div className="ps-labels">
          <div className="pf-label" style={{ marginBottom: "6px" }}>Labels</div>
          <div className="label-list">
            {LABELS.map((L) => (
              <button
                key={L.id}
                className={`label-tog ${(t.labels || []).includes(L.id) ? "sel" : ""}`}
                style={{ background: L.bg, color: L.color }}
                onClick={() => toggleLabel(L.id)}
              >
                {L.label}
              </button>
            ))}
          </div>
        </div>

        {!t.parentTaskId && (
          <div className="ps-subtasks">
            <div className="psec-hd">
              <div className="psec-title">Subtasks</div>
              <button
                className="psec-add"
                onClick={() => setModals((m: any) => ({ ...m, task: { open: true, editId: null, parentId: t.id, defaultStatus: null } }))}
                title="Add subtask"
              >
                +
              </button>
            </div>
            {subs.length ? (
              <div className="sub-list">
                {subs.map((s) => {
                  const ss = ST[s.status];
                  return (
                    <div key={s.id} className="sub-item" onClick={() => setPanelTaskId(s.id)}>
                      <span className="si-status" style={{ color: ss.color }}>{ss.icon}</span>
                      <span className="si-title">{s.title}</span>
                      {s.assignee && <Avatar name={s.assignee} size={18} />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ fontSize: "12px", color: "var(--t4)" }}>No subtasks yet.</div>
            )}
          </div>
        )}

        <div className="ps-comments">
          <div className="psec-hd"><div className="psec-title">Comments</div></div>
          {coms.length ? (
             <div className="comment-list">
               {coms.map((c) => (
                 <div key={c.id} className="comment-item">
                   <div className="ci-header">
                     <Avatar name={c.author} size={20} />
                     <span className="ci-name">{c.author}</span>
                     <span className="ci-time">{fmtTs(c.ts)}</span>
                   </div>
                   <div className="ci-text">{c.text}</div>
                 </div>
               ))}
             </div>
          ) : (
             <div style={{ fontSize: "12px", color: "var(--t4)", marginBottom: "8px" }}>No comments yet.</div>
          )}
          
          <div className="comment-form">
            <input
              className="cmt-txt"
              type="text"
              placeholder="Add a comment…"
              value={commentTxt}
              onChange={(e) => setCommentTxt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
            />
            <input
              className="cmt-who"
              type="text"
              placeholder="Your name"
              value={commentWho}
              onChange={(e) => setCommentWho(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
            />
            <button className="post-btn" onClick={handlePostComment}>Post</button>
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <button className="btn-danger" onClick={handleDelete}>Delete</button>
        <button className="btn-ghost" onClick={() => setPanelTaskId(null)}>Cancel</button>
        <button
          className="btn-save"
          onClick={handleSave}
          style={savedVisual ? { background: "#10b981", content: "Saved ✓" } : {}}
        >
          {savedVisual ? "Saved ✓" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
