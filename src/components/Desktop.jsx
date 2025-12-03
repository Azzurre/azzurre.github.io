import React, { useState, useMemo, Suspense } from "react";
import Terminal from "./Terminal.jsx";
import ProjectsWindow from "./ProjectsWindow.jsx";
import AboutWindow from "./AboutWindow.jsx";
import SettingsWindow from "./SettingsWindow.jsx";
import ResumeWindow from "./ResumeWindow.jsx";
import ProfileWindow from "./ProfileWindow.jsx";
import ContactWindow from "./ContactWindow.jsx";
import AdminWindow from "./AdminWindow.jsx";

import HireMeWindow from "./HireMeWindow.jsx";
import DevCardWindow from "./DevCardWindow.jsx";
import Window from "./Window.jsx";
import XPBar from "./XPBar.jsx";
const GitHubWindow = React.lazy(() => import("./GitHubWindow.jsx"));
const AssistantWindow = React.lazy(() => import("./AssistantWindow.jsx"));
const PlaygroundWindow = React.lazy(() => import("./PlaygroundWindow.jsx"));

import { useGameState } from "../context/GameStateContext.jsx";

const Desktop = ({ showToast }) => {
  const [windows, setWindows] = useState([
    { id: "main-terminal", type: "terminal", title: "DevTerminal", z: 1 }
  ]);
  const [zCounter, setZCounter] = useState(2);

  const { registerWindowOpen, recruiterMode } = useGameState();

  const typeToTitle = type => {
    switch (type) {
      case "terminal":
        return "DevTerminal";
      case "projects":
        return "Projects";
      case "about":
        return "About Me";
      case "settings":
        return "Settings";
      case "resume":
        return "Resume";
      case "profile":
        return "Profile & Stats";
      case "contact":
        return "Contact";
      case "github":
        return "GitHub";
      case "admin":
        return "Admin & Analytics";
      case "assistant":
        return "Dev Assistant";
      case "playground":
        return "Code Playground";
      default:
        return "Window";
    }
  };

  const openWindow = type => {
    const id = `${type}-${Date.now()}`;
    setWindows(prev => [
      ...prev,
      { id, type, title: typeToTitle(type), z: zCounter }
    ]);
    setZCounter(zCounter + 1);
    registerWindowOpen && registerWindowOpen();
  };

  const closeWindow = id => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const bringToFront = id => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, z: zCounter } : w))
    );
    setZCounter(zCounter + 1);
  };

  const renderWindowContent = win => {
    switch (win.type) {
      case "terminal":
        return (
          <Terminal openWindow={openWindow} showToast={showToast} />
        );
      case "projects":
        return <ProjectsWindow showToast={showToast} />;
      case "about":
        return <AboutWindow />;
      case "settings":
        return <SettingsWindow showToast={showToast} />;
      case "resume":
        return <ResumeWindow />;
      case "profile":
        return <ProfileWindow />;
      case "contact":
        return <ContactWindow />;
      case "github":
        return (
          <Suspense fallback={<div>Loading GitHub...</div>}>
            <GitHubWindow />
          </Suspense>
        );
      case "admin":
        return <AdminWindow />;
      case "assistant":
        return (
          <Suspense fallback={<div>Loading assistant...</div>}>
            <AssistantWindow />
          </Suspense>
        );
      case "playground":
        return (
          <Suspense fallback={<div>Loading playground...</div>}>
            <PlaygroundWindow />
          </Suspense>
        );
      case "hireme":
        return <HireMeWindow />;
      case "devcard":
        return <DevCardWindow />;
      default:
        return <div>Empty window</div>;
    }
  };

  const topZ = useMemo(
    () => (windows.length ? Math.max(...windows.map(w => w.z)) : 0),
    [windows]
  );

  return (
    <div id="desktop">
      {!recruiterMode && <XPBar />}
      {windows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          zIndex={win.z}
          isActive={win.z === topZ}
          onClose={() => closeWindow(win.id)}
          onFocus={() => bringToFront(win.id)}
        >
          {renderWindowContent(win)}
        </Window>
      ))}

      {/* Taskbar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "28px",
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.8), rgba(30,30,30,0.9))",
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          gap: "6px",
          fontSize: "12px",
          zIndex: 1200
        }}
      >
        {windows.map(win => (
          <button
            key={win.id}
            onClick={() => bringToFront(win.id)}
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              padding: "2px 6px",
              backgroundColor:
                win.z === topZ ? "rgba(255,255,255,0.1)" : "transparent",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            {win.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Desktop;
