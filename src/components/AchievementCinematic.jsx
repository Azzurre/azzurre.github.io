import React, { useEffect } from "react";
import { useGameState } from "../context/GameStateContext.jsx";

const AchievementCinematic = () => {
  const { lastUnlockedAchievement, setLastUnlockedAchievement } =
    useGameState();

  useEffect(() => {
    if (!lastUnlockedAchievement) return;
    const t = setTimeout(() => setLastUnlockedAchievement(null), 2600);
    return () => clearTimeout(t);
  }, [lastUnlockedAchievement, setLastUnlockedAchievement]);

  if (!lastUnlockedAchievement) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(circle at center, rgba(0,0,0,0.1), rgba(0,0,0,0.96))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5000,
        color: "#f5f5f5",
        fontFamily: "Roboto Mono, monospace",
        animation: "cinematic-fade 2.6s ease-out forwards"
      }}
    >
      <div
        style={{
          padding: "24px 32px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 0 40px rgba(0, 209, 178, 0.8)",
          textAlign: "center",
          maxWidth: "420px",
          backdropFilter: "blur(10px)",
          transform: "scale(1)",
          animation: "cinematic-pop 0.4s ease-out"
        }}
      >
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.8,
            marginBottom: "4px"
          }}
        >
          Achievement Unlocked
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "8px"
          }}
        >
          {lastUnlockedAchievement}
        </div>
        <div style={{ fontSize: "13px", opacity: 0.8 }}>
          Keep exploring the DevTerminal to discover more hidden achievements.
        </div>
      </div>
    </div>
  );
};

export default AchievementCinematic;
