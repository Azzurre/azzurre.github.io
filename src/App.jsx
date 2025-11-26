import React, { useState } from "react";
import Desktop from "./components/Desktop.jsx";
import ParticlesBackground from "./components/ParticlesBackground.jsx";
import VolumeControl from "./components/VolumeControl.jsx";
import Toast from "./components/Toast.jsx";
import SimplePortfolio from "./components/SimplePortfolio.jsx";

const App = () => {
  const [toast, setToast] = useState(null);
  const [simpleMode, setSimpleMode] = useState(false);

  const showToast = (message, duration = 3000) => {
    setToast({ message });
    setTimeout(() => setToast(null), duration);
  };

  return (
    <>
      <ParticlesBackground />
      {!simpleMode && (
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
        </>
      )}
      {simpleMode && <SimplePortfolio onClose={() => setSimpleMode(false)} />}
      <VolumeControl />
      {toast && <Toast message={toast.message} />}
    </>
  );
};

export default App;
