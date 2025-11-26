import { projectsFS } from "./fileSystem.js";
import { jsPDF } from "jspdf";

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
recruiter      - Toggle recruiter mode (CV-focused)
hire me        - Open Hire Me mode window
recommend      - Get smart suggestions on what to try
matrix         - Trigger a matrix-style easter egg
coffee         - Take a virtual coffee break
whoami         - Reveal the developer identity
ping universe  - Ping the universe
dimitri mode   - Unlock a special Dimitri-themed response
generate pdf   - (Concept) Generate a PDF portfolio
export analytics - Export session analytics (concept)
share profile  - Open a shareable dev profile card
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
    appendOutput(
      "2) Projects window opened – explore featured work."
    );
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

  if (lower === "recruiter") {
    gameActions?.toggleRecruiterMode &&
      gameActions.toggleRecruiterMode();
    appendOutput("Toggled recruiter mode. Focused CV / experience view.");
    openWindow("resume");
    openWindow("contact");
    return;
  }


  if (lower === "share profile") {
    openWindow("devcard");
    appendOutput("Opening shareable dev profile card...");
    return;
  }

  if (lower === "hire me") {
    gameActions?.toggleRecruiterMode &&
      gameActions.toggleRecruiterMode();
    openWindow("resume");
    openWindow("contact");
    openWindow("hireme");
    appendOutput("Opening Hire Me mode – CV, availability, and contact.");
    return;
  }

  if (lower === "recommend") {
    const profile = gameActions?.visitorProfile || "neutral";
    if (profile === "power") {
      appendOutput(
        "You seem like a power user. Try: 'admin', 'playground', 'assistant', or 'export analytics'."
      );
    } else if (profile === "visual") {
      appendOutput(
        "You seem to like visuals. Try: 'show projects', 'open resume', or Simple Portfolio Mode button."
      );
    } else {
      appendOutput(
        "Good next commands: 'show projects', 'open resume', 'profile', or 'quest'."
      );
    }
    return;
  }

  if (lower === "matrix") {
    appendOutput("Entering matrix mode...");
    const rows = 8;
    for (let i = 0; i < rows; i++) {
      const line = Array.from({ length: 40 })
        .map(() => (Math.random() > 0.5 ? 1 : 0))
        .join("");
      appendOutput(line);
    }
    appendOutput("...exiting matrix.");
    return;
  }

  if (lower === "coffee") {
    appendOutput("☕ Virtual coffee break initiated. Remember to hydrate and stretch.");
    return;
  }

  if (lower === "whoami") {
    appendOutput(
      "Dimitri – software developer with a fighter mindset (MMA / Muay Thai) and a love for building interactive systems."
    );
    return;
  }

  if (lower === "ping universe") {
    appendOutput("Pinging universe...");
    appendOutput("Response: 42 ms · Status: Still expanding · Message: Keep building.");
    return;
  }

  if (lower === "dimitri mode") {
    appendOutput(
      "Dimitri mode activated: high focus, disciplined grind, and relentless improvement."
    );
    gameActions?.addXP && gameActions.addXP(30, "Dimitri Mode");
    return;
  }

  if (lower === "generate pdf") {
    try {
      const doc = new jsPDF();
      const lvl = gameActions?.level ?? 1;
      const xp = gameActions?.score ?? 0;
      const next = gameActions?.nextLevelXP ?? 100;
      const skills = gameActions?.skillXP || { web: 0, game: 0, systems: 0 };

      doc.setFontSize(16);
      doc.text("Dimitri - Software Developer", 10, 15);

      doc.setFontSize(11);
      doc.text("Interactive DevTerminal Portfolio Summary", 10, 25);

      doc.text(`Level: ${lvl}`, 10, 40);
      doc.text(`XP: ${xp} / ${next}`, 10, 47);

      doc.text("Skill XP:", 10, 60);
      doc.text(`Web: ${skills.web}`, 16, 67);
      doc.text(`Game: ${skills.game}`, 16, 74);
      doc.text(`Systems: ${skills.systems}`, 16, 81);

      const ach = gameActions?.achievements || [];
      doc.text("Achievements:", 10, 95);
      if (ach.length) {
        const chunk = ach.join(", ");
        doc.text(doc.splitTextToSize(chunk, 180), 16, 102);
      } else {
        doc.text("None yet", 16, 102);
      }

      doc.text(
        "Visit the live DevTerminal for full interactive experience.",
        10,
        130
      );

      doc.save("dimitri-portfolio-summary.pdf");
      appendOutput("Generated PDF portfolio summary: dimitri-portfolio-summary.pdf");
    } catch (err) {
      appendOutput("Failed to generate PDF: " + err.message);
    }
    return;
  }

  if (lower === "export analytics") {
    const usage = gameActions?.commandUsage || {};
    const windowsOpened = gameActions?.windowOpenCount || 0;
    const projectsViewed = gameActions?.projectViewCount || 0;
    const profile = gameActions?.visitorProfile || "neutral";
    const payload = {
      visitorProfile: profile,
      commands: usage,
      windowsOpened,
      projectsViewed
    };
    appendOutput(
      "[Concept] Recruiter analytics export (JSON):\n" +
        JSON.stringify(payload, null, 2)
    );
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
