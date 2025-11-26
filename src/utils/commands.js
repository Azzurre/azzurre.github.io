import { projectsFS } from "./fileSystem.js";

export const baseHelpText = `Available commands:
help           - Show available commands
clear          - Clear the terminal
show projects  - Open Projects window
show about     - Open About window
settings       - Open settings window
ls             - List files and directories
cat [file]     - Show file content
open resume    - Open resume in a window
contact        - Open contact window
github         - Show GitHub activity
quest          - Start a new quest
challenge      - Start a random challenge
score          - Display your current XP
achievements   - Show your unlocked achievements
profile        - Open profile & stats window
tour           - Start a guided tour
assistant      - Open Dev Assistant window
playground     - Open code playground
admin          - Open admin & analytics (requires sudo mode)
sudo mode      - Toggle admin mode
`;

export const processCommandInput = ({
  cmd,
  appendOutput,
  clearOutput,
  openWindow,
  showToast,
  gameActions
}) => {
  const lower = cmd.toLowerCase();

  // track usage
  gameActions?.incrementCommandUsage &&
    gameActions.incrementCommandUsage(lower);

  if (lower === "help") {
    appendOutput(baseHelpText);
    return;
  }

  if (lower === "clear") {
    clearOutput();
    return;
  }

  if (lower === "show projects") {
    openWindow("projects");
    appendOutput("Opening Projects window...");
    return;
  }

  if (lower === "show about") {
    openWindow("about");
    appendOutput("Opening About window...");
    return;
  }

  if (lower === "settings") {
    openWindow("settings");
    appendOutput("Opening Settings window...");
    return;
  }

  if (lower === "ls") {
    appendOutput(Object.keys(projectsFS["/"].children).join("   "));
    return;
  }

  if (lower.startsWith("cat")) {
    const [, file] = cmd.split(" ");
    if (!file) {
      appendOutput("Usage: cat [file]");
      return;
    }
    const content = getFileContent(file);
    appendOutput(content ?? `File not found: ${file}`);
    return;
  }

  if (lower === "open resume" || lower === "open resume.pdf") {
    openWindow("resume");
    appendOutput("Opening resume window...");
    return;
  }

  if (lower === "contact") {
    openWindow("contact");
    appendOutput("Opening contact window...");
    return;
  }

  if (lower === "github") {
    openWindow("github");
    appendOutput("Fetching GitHub data...");
    return;
  }

  if (lower === "quest") {
    gameActions?.startQuest && gameActions.startQuest(appendOutput);
    return;
  }

  if (lower === "challenge") {
    gameActions?.startChallenge &&
      gameActions.startChallenge(appendOutput);
    return;
  }

  if (lower === "score") {
    const score = gameActions?.score ?? 0;
    appendOutput(`Current Score: ${score}`);
    return;
  }

  if (lower === "achievements") {
    const list = gameActions?.achievements || [];
    if (!list.length) {
      appendOutput("Achievements: None yet. Start a quest!");
    } else {
      appendOutput("Achievements: " + list.join(", "));
    }
    return;
  }

  if (lower === "profile" || lower === "stats") {
    openWindow("profile");
    appendOutput("Opening profile & stats...");
    return;
  }

  if (lower === "tour") {
    appendOutput("Starting guided tour...");
    openWindow("about");
    appendOutput("1) About window opened – learn who I am.");
    openWindow("projects");
    appendOutput("2) Projects window opened – explore featured work.");
    appendOutput(
      "3) Try typing 'quest' to start a quest, or 'profile' to see XP & achievements."
    );
    return;
  }

  if (lower === "assistant") {
    openWindow("assistant");
    appendOutput("Opening Dev Assistant concept window...");
    return;
  }

  if (lower === "playground") {
    openWindow("playground");
    appendOutput("Opening code playground...");
    return;
  }

  if (lower === "admin") {
    openWindow("admin");
    appendOutput("Opening admin & analytics...");
    return;
  }

  if (lower === "sudo mode") {
    gameActions?.toggleAdminMode && gameActions.toggleAdminMode();
    appendOutput("Toggled admin mode.");
    return;
  }

  appendOutput(`Command not recognized: ${cmd}`);
};

const getFileContent = filename => {
  const root = projectsFS["/"];
  const file = root.children[filename];
  if (file && file.type === "file") return file.content;
  return null;
};
