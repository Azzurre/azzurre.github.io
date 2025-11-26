import React from "react";
import { useGameState } from "../context/GameStateContext.jsx";

const AdminWindow = () => {
  const {
    commandUsage,
    adminMode,
    windowOpenCount,
    projectViewCount,
    startTime,
    visitorProfile
  } = useGameState();

  if (!adminMode) {
    return (
      <p>
        Admin mode is disabled. Use <code>sudo mode</code> in the terminal to
        enable.
      </p>
    );
  }

  const entries = Object.entries(commandUsage || {}).sort(
    (a, b) => b[1] - a[1]
  );
  const totalCommands = entries.reduce((sum, [, count]) => sum + count, 0);
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const uptimeMinutes = (uptimeSeconds / 60).toFixed(1);

  return (
    <div>
      <h2>Admin &amp; Live Analytics</h2>
      <p style={{ fontSize: "13px", opacity: 0.8 }}>
        Client-side analytics for this session only.
      </p>

      <section style={{ marginTop: "8px" }}>
        <h3>Session Overview</h3>
        <ul style={{ fontSize: "13px" }}>
          <li>
            Detected visitor profile: <strong>{visitorProfile}</strong>
          </li>
          <li>Total commands executed: {totalCommands}</li>
          <li>Windows opened: {windowOpenCount}</li>
          <li>Projects viewed: {projectViewCount}</li>
          <li>Time on site: {uptimeMinutes} min</li>
        </ul>
      </section>

      <section style={{ marginTop: "10px" }}>
        <h3>Command Usage</h3>
        {entries.length === 0 ? (
          <p>No commands recorded yet.</p>
        ) : (
          <ul>
            {entries.map(([cmd, count]) => (
              <li key={cmd}>
                <code>{cmd}</code>: {count}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminWindow;
