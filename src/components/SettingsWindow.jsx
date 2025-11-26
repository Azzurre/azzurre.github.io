import React, { useState } from "react";
import { useGameState } from "../context/GameStateContext.jsx";

const SettingsWindow = ({ showToast }) => {
  const { theme, setTheme, uiStyle, setUiStyle } = useGameState();
  const [particles, setParticles] = useState(true);

  const save = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("uiStyle", uiStyle);
    showToast && showToast("Settings saved");
  };

  return (
    <div>
      <h2>Settings</h2>

      <div className="settings-row" style={{ marginTop: "10px" }}>
        <label>Theme preset&nbsp;</label>
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="terminal">Retro Terminal</option>
          <option value="cyberpunk">Cyberpunk</option>
        </select>
      </div>

      <div className="settings-row" style={{ marginTop: "10px" }}>
        <label>UI Style&nbsp;</label>
        <select value={uiStyle} onChange={e => setUiStyle(e.target.value)}>
          <option value="classic">Classic</option>
          <option value="modern">Modern</option>
        </select>
      </div>

      <div className="settings-row" style={{ marginTop: "10px" }}>
        <label>Interactive Particles&nbsp;</label>
        <input
          type="checkbox"
          checked={particles}
          onChange={e => setParticles(e.target.checked)}
        />
      </div>

      <button onClick={save} style={{ marginTop: "10px" }}>
        Save Settings
      </button>
    </div>
  );
};

export default SettingsWindow;
