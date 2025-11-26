import React, { useState } from "react";
import Terminal from "./Terminal.jsx";
import ProjectsWindow from "./ProjectsWindow.jsx";
import AboutWindow from "./AboutWindow.jsx";
import SettingsWindow from "./SettingsWindow.jsx";
import ResumeWindow from "./ResumeWindow.jsx";
import ProfileWindow from "./ProfileWindow.jsx";
import ContactWindow from "./ContactWindow.jsx";
import GitHubWindow from "./GitHubWindow.jsx";
import AdminWindow from "./AdminWindow.jsx";
import AssistantWindow from "./AssistantWindow.jsx";
import PlaygroundWindow from "./PlaygroundWindow.jsx";
import Window from "./Window.jsx";
import XPBar from "./XPBar.jsx";

const Desktop = ({ showToast }) => {
  const [windows, setWindows] = useState([
    { id: "main-terminal", type: "terminal", title: "DevTerminal", z: 1 }
  ]);
  const [zCounter, setZCounter] = useState(2);

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
        return <GitHubWindow />;
      case "admin":
        return <AdminWindow />;
      case "assistant":
        return <AssistantWindow />;
      case "playground":
        return <PlaygroundWindow />;
      default:
        return <div>Empty window</div>;
    }
  };

  return (
    <div id="desktop">
      <XPBar />
      {windows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          zIndex={win.z}
          onClose={() => closeWindow(win.id)}
          onFocus={() => bringToFront(win.id)}
        >
          {renderWindowContent(win)}
        </Window>
      ))}
    </div>
  );
};

export default Desktop;
