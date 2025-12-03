import React from "react";
import { useGameState } from "../context/GameStateContext.jsx";

const XPBar = () => {
  const { score, nextLevelXP, level } = useGameState();
  const percent = Math.min((score / nextLevelXP) * 100, 100);

  return (
    <>
      <div id="xp-bar-container">
        <div id="xp-bar" style={{ width: `${percent}%` }}></div>
      </div>
      <div id="level-indicator">Level {level}</div>
    </>
  );
};

export default XPBar;
