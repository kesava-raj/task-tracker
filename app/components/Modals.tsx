"use client";
import React, { useState, useEffect } from "react";
import { useAppStore } from "../store";
import { uid, today } from "../utils";
import { EMOJIS, COLORS, LABELS } from "../types";


const ProjectModal = ({ isOpen, projId, onClose }: { isOpen: boolean; projId: string | null; onClose: () => void }) => {
  const { db, updateDb } = useAppStore();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (projId && typeof projId === "string") {
        const p = db.projects.find((pr) => pr.id === projId);
        if (p) {
          setName(p.name);
          setDesc(p.description || "");
          setEmoji(p.emoji);
          setColor(p.color);
        }
      } else {
        setName("");
        setDesc("");
        setEmoji(EMOJIS[0]);
        setColor(COLORS[0]);
      }
      setErr(false);
    }
  }, [isOpen, projId, db.projects]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      setErr(true);
      return;
    }
    const data = { name: name.trim(), description: desc.trim(), emoji, color };
    
    if (projId && typeof projId === "string") {
      const newProjects = [...db.projects];
      const idx = newProjects.findIndex((p) => p.id === projId);
      newProjects[idx] = { ...newProjects[idx], ...data };
      updateDb({ ...db, projects: newProjects });
    } else {
      const newProject = { id: uid(), ...data, createdAt: today() };
      updateDb({ ...db, projects: [...db.projects, newProject] });
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal md-sm">
        <div className="modal-hd">
          <span className="modal-title">{projId && typeof projId === "string" ? "Edit Project" : "New Project"}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-bd">
          <div className="fg">
            <label className="field-label">Project Name *</label>
            <input
              className={`field-input ${err ? "err" : ""}`}
              type="text"
              placeholder="e.g. ClearBid"
              value={name}
              onChange={(e) => { setName(e.target.value); setErr(false); }}
            />
          </div>
          <div className="fg">
            <label className="field-label">Description</label>
            <textarea
              className="field-input"
              rows={2}
              style={{ resize: "vertical" }}
              placeholder="Short description…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="fg">
            <label className="field-label">Icon</label>
            <div className="emoji-grid">
              {EMOJIS.map((e) => (
                <div key={e} className={`emoji-opt ${e === emoji ? "sel" : ""}`} onClick={() => setEmoji(e)}>
                  {e}
                </div>
              ))}
            </div>
          </div>
          <div className="fg">
            <label className="field-label">Color</label>
            <div className="color-swatches">
              {COLORS.map((c) => (
                <div
                  key={c}
                  className={`color-sw ${c === color ? "sel" : ""}`}
                  style={{ background: c, "--sw-c": c } as React.CSSProperties}
                  onClick={() => setColor(c)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-ft">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Project</button>
        </div>
      </div>
    </div>
  );
};

const TaskModal = ({ isOpen, taskId, parentId, defaultStatus, onClose }: { isOpen: boolean; taskId: string | null; parentId: string | null; defaultStatus: string | null; onClose: () => void }) => {
  const { db, ui, updateDb, setExpandedRows, setExpandedGroups } = useAppStore();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("todo");
  const [pri, setPri] = useState("none");
  const [assignee, setAssignee] = useState("");
  const [labelsRaw, setLabelsRaw] = useState("");
  const [start, setStart] = useState("");
  const [due, setDue] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (taskId) {
        const t = db.tasks.find((task) => task.id === taskId);
        if (t) {
          setTitle(t.title || "");
          setDesc(t.description || "");
          setStatus(t.status || "todo");
          setPri(t.priority || "none");
          setAssignee(t.assignee || "");
          setLabelsRaw((t.labels || []).map((id) => LABELS.find((L) => L.id === id)?.label || id).join(", "));
          setStart(t.startDate || "");
          setDue(t.dueDate || "");
        }
      } else {
        setTitle("");
        setDesc("");
        setStatus(defaultStatus || "todo");
        setPri("none");
        setAssignee("");
        setLabelsRaw("");
        setStart("");
        setDue("");
      }
      setErr(false);
    }
  }, [isOpen, taskId, defaultStatus, db.tasks]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) {
      setErr(true);
      return;
    }

    const rawLabs = labelsRaw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    const lids = rawLabs.map((r) => LABELS.find((L) => L.label.toLowerCase() === r || L.id === r)?.id).filter(Boolean) as string[];

    const data = {
      title: title.trim(),
      description: desc.trim(),
      status: status as any,
      priority: pri as any,
      assignee: assignee.trim(),
      labels: lids,
      startDate: start,
      dueDate: due,
    };

    if (taskId) {
      const newTasks = [...db.tasks];
      const idx = newTasks.findIndex((t) => t.id === taskId);
      newTasks[idx] = { ...newTasks[idx], ...data };
      updateDb({ ...db, tasks: newTasks });
    } else {
      const pid = ui.pid || (parentId ? db.tasks.find((t) => t.id === parentId)?.projectId : null) || null;
      if (!pid) return; // shouldn't happen usually unless user is creating task on home without project
      const newTask = {
        id: uid(),
        projectId: pid,
        parentTaskId: parentId || null,
        ...data,
        createdAt: today(),
      };
      updateDb({ ...db, tasks: [...db.tasks, newTask] });
      
      if (parentId) {
        setExpandedRows((prev) => new Set(prev).add(parentId));
      }
      setExpandedGroups((prev) => new Set(prev).add(data.status));
    }
    onClose();
  };

  const isSub = parentId || (taskId && db.tasks.find(t => t.id === taskId)?.parentTaskId);

  return (
    <div className="modal-overlay">
      <div className="modal md-lg">
        <div className="modal-hd">
          <span className="modal-title">{taskId ? (isSub ? "Edit Subtask" : "Edit Task") : (isSub ? "New Subtask" : "New Task")}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-bd">
          <div className="fg">
            <label className="field-label">Task Title *</label>
            <input
              className={`field-input ${err ? "err" : ""}`}
              type="text"
              placeholder="Task name"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErr(false); }}
            />
          </div>
          <div className="fg">
            <label className="field-label">Description</label>
            <textarea
              className="field-input"
              rows={2}
              style={{ resize: "vertical" }}
              placeholder="What needs to be done…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="fg2">
            <div className="fg">
              <label className="field-label">Status</label>
              <select className="field-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="todo">○ Todo</option>
                <option value="inprogress">◑ In Progress</option>
                <option value="inreview">◆ In Review</option>
                <option value="done">✓ Done</option>
                <option value="cancelled">✕ Cancelled</option>
              </select>
            </div>
            <div className="fg">
              <label className="field-label">Priority</label>
              <select className="field-input" value={pri} onChange={(e) => setPri(e.target.value)}>
                <option value="none">– No Priority</option>
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">⬇ Low</option>
              </select>
            </div>
            <div className="fg">
              <label className="field-label">Assignee</label>
              <select className="field-input" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
                <option value="">Unassigned</option>
                {(db.assignees || []).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label className="field-label">Labels (comma sep.)</label>
              <input className="field-input" type="text" placeholder="Bug, Feature, Docs…" value={labelsRaw} onChange={(e) => setLabelsRaw(e.target.value)} />
            </div>
            <div className="fg">
              <label className="field-label">Start Date</label>
              <input className="field-input" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="fg">
              <label className="field-label">Due Date</label>
              <input className="field-input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-ft">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save Task</button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, type, id, onClose }: { isOpen: boolean; type: "project" | "task"; id: string | null; onClose: () => void }) => {
  const { db, updateDb, setPanelTaskId, panelTaskId, ui, setUi } = useAppStore();
  
  if (!isOpen || !id) return null;

  const handleDelete = () => {
    if (type === "project") {
      updateDb({
        ...db,
        tasks: db.tasks.filter((t) => t.projectId !== id),
        projects: db.projects.filter((p) => p.id !== id),
      });
      if (ui.pid === id) {
        setUi((prev) => ({ ...prev, screen: "home", pid: null }));
        setPanelTaskId(null);
      }
    } else {
      // delete subtasks first
      const subs = db.tasks.filter((t) => t.parentTaskId === id);
      const subIds = subs.map((s) => s.id);
      
      updateDb({
        ...db,
        comments: db.comments.filter((c) => c.taskId !== id && !subIds.includes(c.taskId)),
        tasks: db.tasks.filter((t) => t.id !== id && t.parentTaskId !== id),
      });

      if (panelTaskId === id) {
        setPanelTaskId(null);
      }
    }
    onClose();
  };

  return (
    <div className="modal-overlay confirm-modal">
      <div className="modal md-sm">
        <div className="modal-hd">
          <span className="modal-title">{type === "project" ? "Delete Project" : "Delete Task"}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-bd">
          <p>
            {type === "project"
              ? "This will permanently delete the project and all its tasks and data. This action cannot be undone."
              : "This will permanently delete this task and all its subtasks. This action cannot be undone."}
          </p>
        </div>
        <div className="modal-ft">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

const AssigneesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { db, updateDb } = useAppStore();
  const [newName, setNewName] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newName.trim() || (db.assignees || []).includes(newName.trim())) return;
    updateDb({ ...db, assignees: [...(db.assignees || []), newName.trim()] });
    setNewName("");
  };

  const handleRemove = (name: string) => {
    updateDb({
      ...db,
      assignees: (db.assignees || []).filter((a) => a !== name),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal md-sm">
        <div className="modal-hd">
          <span className="modal-title">Manage Team</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-bd">
          <div className="fg" style={{ display: "flex", gap: "8px" }}>
            <input
              className="field-input"
              type="text"
              placeholder="New team member name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }}
            />
            <button className="btn-save" onClick={handleAdd}>Add</button>
          </div>
          <div className="assignees-list" style={{ marginTop: "16px", maxHeight: "250px", overflowY: "auto" }}>
            {(db.assignees || []).map((a) => (
              <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid var(--bdr)", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: 500 }}>{a}</span>
                <button className="icon-btn del" onClick={() => handleRemove(a)} title="Remove member">✕</button>
              </div>
            ))}
            {(db.assignees || []).length === 0 && (
              <div style={{ fontSize: "12px", color: "var(--t4)", textAlign: "center", padding: "12px" }}>No team members added yet.</div>
            )}
          </div>
        </div>
        <div className="modal-ft">
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export const Modals = () => {
  const { modals, setModals } = useAppStore();

  const closeProj = () => setModals((m: any) => ({ ...m, proj: null }));
  const closeTask = () => setModals((m: any) => ({ ...m, task: { open: false, editId: null, parentId: null, defaultStatus: null } }));
  const closeConfirm = () => setModals((m: any) => ({ ...m, confirm: { open: false, type: "task", id: null } }));

  return (
    <>
      <ProjectModal isOpen={!!modals.proj} projId={typeof modals.proj === "string" ? modals.proj : null} onClose={closeProj} />
      <TaskModal
        isOpen={modals.task.open}
        taskId={modals.task.editId}
        parentId={modals.task.parentId}
        defaultStatus={modals.task.defaultStatus}
        onClose={closeTask}
      />
      <AssigneesModal
        isOpen={modals.assignees}
        onClose={() => setModals((m: any) => ({ ...m, assignees: false }))}
      />
      <ConfirmModal
        isOpen={modals.confirm.open}
        type={modals.confirm.type as any}
        id={modals.confirm.id}
        onClose={closeConfirm}
      />
    </>
  );
};
