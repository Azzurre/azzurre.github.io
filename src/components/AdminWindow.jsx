import React from "react";
import { useGameState } from "../context/GameStateContext.jsx";

const AdminWindow = () => {
  const { commandUsage, adminMode } = useGameState();

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

  return (
    <div>
      <h2>Admin &amp; Analytics</h2>
      <p style={{ fontSize: "13px", opacity: 0.8 }}>
        Basic client-side analytics showing how the terminal is being used.
      </p>

      <h3 style={{ marginTop: "10px" }}>Command Usage</h3>
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
    </div>
  );
};

export default AdminWindow;
