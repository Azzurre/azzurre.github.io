import React, { createContext, useContext, useState, useEffect } from "react";

const GameStateContext = createContext(null);

import { QUESTS, CHALLENGES } from "../config/gameConfig.js";


export const GameStateProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [nextLevelXP, setNextLevelXP] = useState(100);
  const [achievements, setAchievements] = useState([]);
  const [currentQuest, setCurrentQuest] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    const hour = new Date().getHours();
    // Daytime: lighter / classic, Night: dark / cyber
    if (hour >= 7 && hour < 19) return "light";
    return "dark";
  });
  const [uiStyle, setUiStyle] = useState(
    localStorage.getItem("uiStyle") || "classic"
  );

  const [adminMode, setAdminMode] = useState(false);
  const [commandUsage, setCommandUsage] = useState({});
  const [windowOpenCount, setWindowOpenCount] = useState(0);
  const [projectViewCount, setProjectViewCount] = useState(0);
  const [startTime] = useState(() => Date.now());

  const [skillXP, setSkillXP] = useState({
    web: 0,
    game: 0,
    systems: 0
  });

  const [lastUnlockedAchievement, setLastUnlockedAchievement] = useState(null);

  const [visitorProfile, setVisitorProfile] = useState("neutral"); // neutral | power | visual
  const [recruiterMode, setRecruiterMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("light-mode", theme === "light");
    document.body.classList.toggle("modern", uiStyle === "modern");
    document.body.classList.toggle("theme-terminal", theme === "terminal");
    document.body.classList.toggle("theme-cyberpunk", theme === "cyberpunk");
  }, [theme, uiStyle]);

  const addXP = (amount, achievementName) => {
    setScore(prev => {
      const newScore = prev + amount;
      if (newScore >= nextLevelXP) {
        setLevel(l => l + 1);
        setNextLevelXP(prevXP => prevXP + 50);
      }
      return newScore;
    });

    if (achievementName) {
      setAchievements(prev => {
        if (prev.includes(achievementName)) return prev;
        setLastUnlockedAchievement(achievementName);
        return [...prev, achievementName];
      });
    }
  };

  const addSkillXP = (category, amount) => {
    setSkillXP(prev => ({
      ...prev,
      [category]: (prev[category] || 0) + amount
    }));
  };

  const incrementCommandUsage = cmd => {
    setCommandUsage(prev => {
      const updated = {
        ...prev,
        [cmd]: (prev[cmd] || 0) + 1
      };
      const totalCommands = Object.values(updated).reduce(
        (sum, v) => sum + v,
        0
      );
      if (totalCommands >= 10) {
        setVisitorProfile("power");
      }
      return updated;
    });
  };

  const registerWindowOpen = () => {
    setWindowOpenCount(prev => {
      const next = prev + 1;
      const totalCommands = Object.values(commandUsage).reduce(
        (sum, v) => sum + v,
        0
      );
      if (next >= 6 && totalCommands < 5) {
        setVisitorProfile("visual");
      }
      return next;
    });
  };

  const registerProjectView = () => {
    setProjectViewCount(prev => prev + 1);
  };

  const startQuest = appendOutput => {
    const available = QUESTS.filter(q => !achievements.includes(q.achievement));
    if (available.length === 0) {
      appendOutput &&
        appendOutput(
          "✔️ No new quests available at the moment. You've completed them all!"
        );
      return;
    }
    const q = available[Math.floor(Math.random() * available.length)];
    setCurrentQuest(q);
    appendOutput &&
      appendOutput(
        `🛠 New Quest: ${q.questText} (Reward: ${q.reward} XP, Achievement: ${q.achievement})`
      );
  };

  const handleQuestCommand = (cmd, appendOutput, showToast) => {
    if (!currentQuest) return false;
    if (cmd === currentQuest.expectedCommand) {
      if (!achievements.includes(currentQuest.achievement)) {
        addXP(currentQuest.reward, currentQuest.achievement);
        appendOutput &&
          appendOutput(
            `Quest completed! You earned ${currentQuest.reward} XP and unlocked achievement: ${currentQuest.achievement}`
          );
        showToast &&
          showToast(
            `Quest completed! +${currentQuest.reward} XP, ${currentQuest.achievement}`
          );
      }
      setCurrentQuest(null);
      return true;
    }
    return false;
  };

  const startChallenge = appendOutput => {
    const ch =
      CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    setCurrentChallenge(ch);
    appendOutput &&
      appendOutput(`⚡ Challenge: ${ch.description} (Reward: ${ch.reward} XP)`);
  };

  const handleChallengeCommand = (cmd, appendOutput, showToast) => {
    if (!currentChallenge) return false;
    if (cmd === currentChallenge.command) {
      if (!achievements.includes(currentChallenge.achievement)) {
        addXP(currentChallenge.reward, currentChallenge.achievement);
        appendOutput &&
          appendOutput(
            `Challenge completed! +${currentChallenge.reward} XP, ${currentChallenge.achievement}`
          );
        showToast &&
          showToast(
            `Challenge completed! +${currentChallenge.reward} XP, ${currentChallenge.achievement}`
          );
      }
      setCurrentChallenge(null);
      return true;
    }
    return false;
  };

  const toggleAdminMode = () => {
    setAdminMode(v => !v);
  };

  const toggleRecruiterMode = () => {
    setRecruiterMode(v => !v);
  };

  const value = {
    score,
    level,
    nextLevelXP,
    achievements,
    currentQuest,
    currentChallenge,
    theme,
    setTheme,
    uiStyle,
    setUiStyle,

    adminMode,
    toggleAdminMode,
    commandUsage,
    incrementCommandUsage,
    windowOpenCount,
    registerWindowOpen,
    projectViewCount,
    registerProjectView,
    startTime,

    skillXP,
    addSkillXP,

    visitorProfile,
    recruiterMode,
    toggleRecruiterMode,

    lastUnlockedAchievement,
    setLastUnlockedAchievement,

    addXP,
    startQuest,
    handleQuestCommand,
    startChallenge,
    handleChallengeCommand
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);
