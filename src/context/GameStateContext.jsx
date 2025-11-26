import React, { createContext, useContext, useState, useEffect } from "react";

const GameStateContext = createContext(null);

const QUESTS = [
  {
    expectedCommand: "open resume",
    questText: "Type 'open resume' to view my CV.",
    reward: 100,
    achievement: "CV Explorer"
  },
  {
    expectedCommand: "show projects",
    questText: "Type 'show projects' to explore my projects.",
    reward: 80,
    achievement: "Project Navigator"
  },
  {
    expectedCommand: "show about",
    questText: "Type 'show about' to learn more about me.",
    reward: 60,
    achievement: "About Me"
  },
  {
    expectedCommand: "settings",
    questText: "Type 'settings' to configure your experience.",
    reward: 25,
    achievement: "Settings Expert"
  },
  {
    expectedCommand: "quest",
    questText: "Type 'quest' to discover another quest.",
    reward: 10,
    achievement: "Quest Master"
  },
  {
    expectedCommand: "score",
    questText: "Type 'score' to check your XP points.",
    reward: 10,
    achievement: "XP Collector"
  },
  {
    expectedCommand: "achievements",
    questText: "Type 'achievements' to see your unlocked achievements.",
    reward: 15,
    achievement: "Achievement Hunter"
  }
];

const CHALLENGES = [
  {
    command: "debug",
    description: "Type 'debug' to simulate a debugging challenge.",
    reward: 30,
    achievement: "Bug Buster"
  },
  {
    command: "optimize",
    description: "Type 'optimize' to optimize a piece of code.",
    reward: 50,
    achievement: "Optimizer"
  }
];

export const GameStateProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [nextLevelXP, setNextLevelXP] = useState(100);
  const [achievements, setAchievements] = useState([]);
  const [currentQuest, setCurrentQuest] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );
  const [uiStyle, setUiStyle] = useState(
    localStorage.getItem("uiStyle") || "classic"
  );
  const [adminMode, setAdminMode] = useState(false);
  const [commandUsage, setCommandUsage] = useState({});

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
      setAchievements(prev =>
        prev.includes(achievementName) ? prev : [...prev, achievementName]
      );
    }
  };

  const incrementCommandUsage = cmd => {
    setCommandUsage(prev => ({
      ...prev,
      [cmd]: (prev[cmd] || 0) + 1
    }));
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
    addXP,
    startQuest,
    handleQuestCommand,
    startChallenge,
    handleChallengeCommand,
    incrementCommandUsage
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);
