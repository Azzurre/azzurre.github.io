import React from "react";
import { useGameState } from "../context/GameStateContext.jsx";

const DevCardWindow = () => {
  const { level, score, nextLevelXP, skillXP, achievements } = useGameState();
  const percent = Math.min((score / nextLevelXP) * 100, 100).toFixed(0);

  return (
    <div>
      <h2>Dev Profile Card</h2>
      <p style={{ fontSize: "13px", opacity: 0.85 }}>
        A compact snapshot of my current "RPG stats" as a developer.
        This layout is ideal for turning into a shareable image.
      </p>

      <div
        style={{
          marginTop: "10px",
          padding: "12px 14px",
          borderRadius: "12px",
          border: "1px solid var(--accent-color)",
          background:
            "radial-gradient(circle at top, rgba(0,0,0,0.4), rgba(0,0,0,0.9))"
        }}
      >
        <div style={{ fontSize: "12px", opacity: 0.8 }}>Dimitri · Software Developer</div>
        <div style={{ fontSize: "18px", marginTop: "4px" }}>
          Level {level} · {score} XP ({percent}% to next)
        </div>

        <div style={{ marginTop: "8px", fontSize: "13px" }}>
          <div>Web Dev XP: {skillXP.web}</div>
          <div>Game Dev XP: {skillXP.game}</div>
          <div>Systems XP: {skillXP.systems}</div>
        </div>

        <div style={{ marginTop: "8px", fontSize: "12px" }}>
          Achievements:{" "}
          {achievements.length ? achievements.join(", ") : "None yet"}
        </div>
      </div>

      <p style={{ marginTop: "8px", fontSize: "12px", opacity: 0.8 }}>
        Tip: you can screenshot this card and share it on LinkedIn or other
        platforms as a visual summary of this interactive portfolio.
      </p>
    </div>
  );
};

export default DevCardWindow;
