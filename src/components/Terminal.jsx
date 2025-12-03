import React, { useState, useRef, useEffect } from "react";
import { processCommandInput } from "../utils/commands.js";
import { useGameState } from "../context/GameStateContext.jsx";

const welcomeText = `Welcome to DevTerminal
Initializing developer terminal...
Loading modules [██████████] 100%
Type 'help' for available commands.
`;

const COMMAND_DESCRIPTIONS = {
  help: "Show all available commands",
  clear: "Clear the terminal output",
  "show projects": "Open Projects window",
  "show about": "Open About window",
  settings: "Open Settings window",
  ls: "List files and directories",
  cat: "Display file content (usage: cat [file])",
  "open resume": "Open resume window",
  contact: "Open contact window",
  github: "View GitHub activity",
  quest: "Start a new quest",
  challenge: "Start a random challenge",
  score: "Display your current XP",
  achievements: "Show unlocked achievements",
  profile: "Open profile & stats",
  tour: "Start a guided tour",
  assistant: "Open Dev Assistant window",
  playground: "Open code playground",
  admin: "Open admin & analytics (needs sudo mode)",
  "sudo mode": "Toggle admin mode",
  recruiter: "Toggle recruiter mode (CV-focused)"
};

const COMMANDS = Object.keys(COMMAND_DESCRIPTIONS);

const Terminal = ({ openWindow, showToast }) => {
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const outputRef = useRef(null);
  const typedOnceRef = useRef(false);

  const {
    startQuest,
    handleQuestCommand,
    startChallenge,
    handleChallengeCommand,
    score,
    achievements,
    incrementCommandUsage,
    toggleAdminMode,
    toggleRecruiterMode,
    commandUsage,
    windowOpenCount,
    projectViewCount,
    visitorProfile,
    level,
    nextLevelXP,
    skillXP
  } = useGameState();

  useEffect(() => {
    if (typedOnceRef.current) return;
    typedOnceRef.current = true;

    let index = 0;
    const type = () => {
      setOutput(prev => prev + welcomeText.charAt(index));
      index++;
      if (index < welcomeText.length) {
        setTimeout(type, 25);
      } else {
        setOutput(prev => prev + "\n");
      }
    };
    type();
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const appendOutput = text => {
    setOutput(prev => prev + text + "\n");
  };

  const clearOutput = () => {
    setOutput("");
  };

  const updateSuggestions = value => {
    const trimmed = value.toLowerCase();
    if (!trimmed) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightIndex(0);
      return;
    }
    const matches = COMMANDS.filter(cmd =>
      cmd.startsWith(trimmed)
    );
    if (matches.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightIndex(0);
    } else {
      setSuggestions(matches);
      setShowSuggestions(true);
      setHighlightIndex(0);
    }
  };

  const runCommand = cmd => {
    const lower = cmd.toLowerCase();

    appendOutput("> " + cmd);
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(history.length + 1);

    // Track usage
    incrementCommandUsage && incrementCommandUsage(lower);

    // First: challenge & quest checks
    handleChallengeCommand(lower, appendOutput, showToast);
    handleQuestCommand(lower, appendOutput, showToast);

    processCommandInput({
      cmd,
      appendOutput,
      clearOutput,
      openWindow,
      showToast,
      gameActions: {
        startQuest,
        startChallenge,
        score,
        achievements,
        incrementCommandUsage,
        toggleAdminMode,
        toggleRecruiterMode,
        commandUsage,
        windowOpenCount,
        projectViewCount,
        visitorProfile,
        level,
        nextLevelXP,
        skillXP
      }
    });
  };

  const handleEnter = () => {
    const cmd = input.trim();
    if (!cmd) return;
    if (showSuggestions && suggestions.length > 0) {
      setInput(suggestions[highlightIndex]);
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    runCommand(cmd);
    setInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEnter();
    } else if (e.key === "ArrowUp") {
      if (showSuggestions && suggestions.length > 0) {
        e.preventDefault();
        setHighlightIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(history[newIndex] || "");
        }
      }
    } else if (e.key === "ArrowDown") {
      if (showSuggestions && suggestions.length > 0) {
        e.preventDefault();
        setHighlightIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(history[newIndex] || "");
        } else {
          setHistoryIndex(history.length);
          setInput("");
        }
      }
    } else if (e.key === "Tab") {
      if (showSuggestions && suggestions.length > 0) {
        e.preventDefault();
        setInput(suggestions[highlightIndex]);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const handleChange = e => {
    const value = e.target.value;
    setInput(value);
    updateSuggestions(value);
  };

  const handleSuggestionClick = suggestion => {
    setInput(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <>
      <div ref={outputRef} className="terminal-output">
        {output}
      </div>
      <div className="terminal-input-line" style={{ position: "relative" }}>
        <span className="terminal-prompt">&gt;</span>
        <input
          className="terminal-input"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="command-suggestions">
            {suggestions.map((s, idx) => (
              <div
                key={s}
                className={
                  "suggestion" + (idx === highlightIndex ? " active" : "")
                }
                onMouseDown={() => handleSuggestionClick(s)}
              >
                <div>{s}</div>
                <div style={{ fontSize: "11px", opacity: 0.8 }}>
                  {COMMAND_DESCRIPTIONS[s]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Terminal;
