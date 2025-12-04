import React, { useState, useEffect } from "react";
import Desktop from "./components/Desktop.jsx";
import ParticlesBackground from "./components/ParticlesBackground.jsx";
import VolumeControl from "./components/VolumeControl.jsx";
import Toast from "./components/Toast.jsx";
import SimplePortfolio from "./components/SimplePortfolio.jsx";
import CursorGlow from "./components/CursorGlow.jsx";
import AchievementCinematic from "./components/AchievementCinematic.jsx";
import { useGameState } from "./context/GameStateContext.jsx";

const App = () => {
  const [toast, setToast] = useState(null);
  const [simpleMode, setSimpleMode] = useState(false);
  const [booting, setBooting] = useState(true);
  const { recruiterMode, toggleRecruiterMode } = useGameState();

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const showToast = (message, duration = 3000) => {
    setToast({ message });
    setTimeout(() => setToast(null), duration);
  };

  return (
    <>
      <ParticlesBackground />
      <AchievementCinematic />
      <CursorGlow />

      {booting && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "radial-gradient(circle at top, #050816, #02030a 60%, #000)",
            color: "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 4000,
            fontFamily: "Roboto Mono, monospace"
          }}
        >
          <div style={{ fontSize: "18px", marginBottom: "10px" }}>
            Booting DevTerminal OS...
          </div>
          <div style={{ fontSize: "14px", opacity: 0.8 }}>
            Initializing modules [██████████] 100%
          </div>
        </div>
      )}

      {!booting && !simpleMode && (
        <>
          <Desktop showToast={showToast} />
          <button
            className="btn-outline"
            style={{
              position: "fixed",
              top: "10px",
              left: "10px",
              zIndex: 2500
            }}
            onClick={() => setSimpleMode(true)}
          >
            Simple Portfolio Mode
          </button>
          <button
            className="btn-outline"
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              zIndex: 2500
            }}
            onClick={toggleRecruiterMode}
          >
            {recruiterMode ? "Exit Recruiter Mode" : "Recruiter Mode"}
          </button>
        </>
      )}

      {!booting && simpleMode && (
        <SimplePortfolio onClose={() => setSimpleMode(false)} />
      )}

      <VolumeControl />
      {toast && <Toast message={toast.message} />}
    </>
  );
};

export default App;
