"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DB, UIState } from "./types";
import { createSeedData } from "./data";

interface AppContextType {
  db: DB;
  ui: UIState;
  setUi: React.Dispatch<React.SetStateAction<UIState>>;
  updateDb: (newDb: DB) => void;
  // Panel state
  panelTaskId: string | null;
  setPanelTaskId: (id: string | null) => void;
  // Drag and Drop
  dragId: string | null;
  setDragId: (id: string | null) => void;
  // Expansions
  expandedGroups: Set<string>;
  setExpandedGroups: React.Dispatch<React.SetStateAction<Set<string>>>;
  expandedRows: Set<string>;
  setExpandedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
  // Modals
  modals: {
    proj: string | boolean | null; // true/id if open
    task: { open: boolean; editId: string | null; parentId: string | null; defaultStatus: string | null };
    assignees: boolean;
    confirm: { open: boolean; type: "project" | "task"; id: string | null };
  };
  setModals: React.Dispatch<React.SetStateAction<any>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [db, setDb] = useState<DB>({ projects: [], tasks: [], comments: [], assignees: [] });
  const [ui, setUi] = useState<UIState>({ screen: "home", pid: null, view: "board", search: "", fPri: "", fAss: "" });
  const [panelTaskId, setPanelTaskId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["todo", "inprogress", "inreview", "done", "cancelled"]));
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [modals, setModals] = useState<{
    proj: string | boolean | null;
    task: { open: boolean; editId: string | null; parentId: string | null; defaultStatus: string | null };
    assignees: boolean;
    confirm: { open: boolean; type: "project" | "task"; id: string | null };
  }>({
    proj: null,
    task: { open: false, editId: null, parentId: null, defaultStatus: null },
    assignees: false,
    confirm: { open: false, type: "task", id: null },
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mpb_ws");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.assignees) parsed.assignees = [];
        setDb(parsed);
      } else {
        const seed = createSeedData();
        setDb(seed);
        localStorage.setItem("mpb_ws", JSON.stringify(seed));
      }
    } catch (e) {}
    setIsMounted(true);
  }, []);

  const updateDb = (newDb: DB) => {
    setDb(newDb);
    try {
      localStorage.setItem("mpb_ws", JSON.stringify(newDb));
    } catch (e) {}
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <AppContext.Provider
      value={{
        db,
        updateDb,
        ui,
        setUi,
        panelTaskId,
        setPanelTaskId,
        dragId,
        setDragId,
        expandedGroups,
        setExpandedGroups,
        expandedRows,
        setExpandedRows,
        modals,
        setModals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};
