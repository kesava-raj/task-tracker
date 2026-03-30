"use client";
import React from "react";
import { AppProvider, useAppStore } from "./store";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { HomeView } from "./components/HomeView";
import { MyTasksView } from "./components/MyTasksView";
import { BoardView } from "./components/BoardView";
import { ListView } from "./components/ListView";
import { RightPanel } from "./components/RightPanel";
import { Modals } from "./components/Modals";

const MainContent = () => {
  const { ui } = useAppStore();

  const renderContent = () => {
    if (ui.screen === "home") return <HomeView />;
    if (ui.screen === "mytasks") return <MyTasksView />;
    if (ui.screen === "project") {
      return ui.view === "board" ? <BoardView /> : <ListView />;
    }
    return null;
  };

  return (
    <div id="content-area">
      {renderContent()}
    </div>
  );
};

export default function TaskTracker() {
  return (
    <AppProvider>
      <div id="app">
        <Sidebar />
        <div id="main">
          <Topbar />
          <MainContent />
        </div>
        <RightPanel />
        <Modals />
      </div>
    </AppProvider>
  );
}
