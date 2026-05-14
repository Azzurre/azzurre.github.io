const githubUsername = "Azzurre";

const featuredProjects = [
  {
    repo: "Rag",
    title: "RAG-Based FightIQ System",
    kicker: "AI / retrieval",
    summary:
      "A retrieval augmented generation system integrating web search, document ingestion, and LLM response generation for domain-specific queries.",
    impact: "Shows applied AI workflow design, information retrieval, prompt engineering, and hallucination mitigation.",
    tech: ["Python", "NLP", "RAG", "Web scraping"],
    featured: true
  },
  {
    repo: "TopDown",
    title: "Asteroid Miner / Shooter Systems",
    kicker: "Game development",
    summary:
      "Unity and C# work focused on procedural generation, real-time enemy AI behaviour, object pooling, spawning systems, responsive UI, and performance constraints.",
    impact: "Shows the gameplay systems, optimisation mindset, and engine skills needed for game-development roles.",
    tech: ["Unity", "C#", "Game AI", "Procedural generation"]
  },
  {
    repo: "LiftLens",
    title: "LiftLens",
    kicker: "Computer vision",
    summary:
      "A fitness-focused pose analysis prototype using MediaPipe and OpenCV to track movement and calculate exercise angles from video.",
    impact: "Connects AI perception with a real user problem: clearer training feedback.",
    tech: ["Python", "MediaPipe", "OpenCV", "Pose landmarks"]
  },
  {
    repo: "World-Cup-Predictor",
    title: "World Cup Predictor",
    kicker: "Machine learning",
    summary:
      "A Python predictor for the 2026 World Cup using synthetic match generation, logistic regression, knockout simulation, and Monte Carlo probability estimates.",
    impact: "Demonstrates modelling, simulation, testing, and explanation of uncertain outcomes.",
    tech: ["Python", "scikit-learn", "Monte Carlo", "pytest"]
  },
  {
    repo: "Sentiment_analyse",
    title: "Social Sentiment Analysis",
    kicker: "NLP",
    summary:
      "A social-media-aware sentiment system combining TF-IDF and Naive Bayes with VADER to handle hashtags, mentions, links, and informal language.",
    impact: "Turns noisy text into actionable labels with confidence scoring and reusable model files.",
    tech: ["Python", "NLTK", "scikit-learn", "pandas"]
  },
  {
    repo: "port_scanner",
    title: "Multithreaded Port Scanner",
    kicker: "Security tooling",
    summary:
      "A lightweight TCP scanner with flexible port input, service detection, multithreaded scanning, and JSON export for authorised testing.",
    impact: "Shows networking fundamentals, responsible security practice, and command-line utility design.",
    tech: ["Python", "Sockets", "Threads", "JSON"]
  },
  {
    repo: "Weather_App",
    title: "Geolocation Weather App",
    kicker: "Frontend",
    summary:
      "A React weather application with geolocation defaults, manual city search, weather API integration, and responsive rendering.",
    impact: "A clean example of API integration, stateful UI, and user-friendly web interaction.",
    tech: ["React", "JavaScript", "Vite", "Weather API"]
  }
];

const fallbackRepos = featuredProjects.map((project, index) => ({
  id: project.repo,
  name: project.repo,
  description: project.summary,
  language: project.tech[0],
  html_url: `https://github.com/${githubUsername}/${project.repo}`,
  pushed_at: index < 3 ? "2026-05-04T00:00:00Z" : "2026-01-01T00:00:00Z",
  stargazers_count: 0,
  forks_count: 0,
  fork: false,
  archived: false
}));

let allRepos = [];
let activeRepoFilter = "Featured";

function readRgb(value, fallback = [122, 167, 255]) {
  const color = value.trim();
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);

  if (hex) {
    const raw = hex[1].length === 3 ? hex[1].split("").map((char) => char + char).join("") : hex[1];
    return [0, 2, 4].map((index) => parseInt(raw.slice(index, index + 2), 16));
  }

  const rgb = color.match(/rgba?\(([^)]+)\)/i);
  if (rgb) {
    const channels = rgb[1]
      .split(/[\s,\/]+/)
      .map((part) => Number.parseFloat(part))
      .filter((part) => Number.isFinite(part));

    if (channels.length >= 3) return channels.slice(0, 3);
  }

  return fallback;
}

function rgba(rgb, alpha) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function getAmbientColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    line: readRgb(styles.getPropertyValue("--line"), [168, 179, 196]),
    accent: readRgb(styles.getPropertyValue("--accent"), [122, 167, 255]),
    accent2: readRgb(styles.getPropertyValue("--accent-2"), [74, 222, 128]),
    accent3: readRgb(styles.getPropertyValue("--accent-3"), [251, 146, 60]),
    accent4: readRgb(styles.getPropertyValue("--accent-4"), [240, 171, 252])
  };
}

function setupAmbientBackground() {
  const canvas = document.getElementById("ambient-canvas");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!canvas || reduceMotion.matches) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context || !window.requestAnimationFrame) return;

  const pointer = {
    x: window.innerWidth * 0.66,
    y: window.innerHeight * 0.36,
    targetX: window.innerWidth * 0.66,
    targetY: window.innerHeight * 0.36,
    active: false,
    pulse: 0
  };

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    colors: getAmbientColors(),
    raf: 0
  };

  function resizeCanvas() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function movePointer(event) {
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    pointer.active = true;
  }

  function drawDiagonalBands(time) {
    const scroll = window.scrollY || 0;
    context.lineWidth = 1;

    for (let index = 0; index < 8; index += 1) {
      const y = ((index * 170 + time * 0.028 + scroll * 0.09) % (state.height + 260)) - 140;
      const color = index % 2 === 0 ? state.colors.accent : state.colors.accent2;

      context.strokeStyle = rgba(color, 0.045);
      context.beginPath();
      context.moveTo(-120, y);
      context.lineTo(state.width + 120, y - state.width * 0.16);
      context.stroke();
    }
  }

  function drawInteractiveGrid(time) {
    const spacing = state.width < 680 ? 60 : 52;
    const radius = state.width < 680 ? 150 : 260;
    const offsetY = -((window.scrollY || 0) * 0.08) % spacing;

    context.lineCap = "square";

    for (let y = offsetY - spacing; y < state.height + spacing; y += spacing) {
      for (let x = -spacing; x < state.width + spacing; x += spacing) {
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const distance = Math.hypot(dx, dy);
        const influence = pointer.active ? Math.max(0, 1 - distance / radius) : 0;
        const pull = influence * 0.08;
        const px = x + dx * pull;
        const py = y + dy * pull;
        const shimmer = Math.sin((x + y) * 0.018 + time * 0.0012) * 1.5;
        const length = 4 + shimmer + influence * 9;
        const color = (x + y) % (spacing * 3) === 0 ? state.colors.accent2 : state.colors.line;

        context.lineWidth = influence > 0.55 ? 1.35 : 1;
        context.strokeStyle = rgba(color, 0.15 + influence * 0.38);
        context.beginPath();
        context.moveTo(px - length, py);
        context.lineTo(px + length, py);
        context.moveTo(px, py - length);
        context.lineTo(px, py + length);
        context.stroke();

        if (influence > 0.44 && (x / spacing + y / spacing) % 2 === 0) {
          context.strokeStyle = rgba(state.colors.accent, (influence - 0.44) * 0.24);
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(px, py);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
      }
    }
  }

  function drawPulse() {
    if (pointer.pulse <= 0.01) return;

    const size = 44 + (1 - pointer.pulse) * 130;
    context.lineWidth = 1.4;
    context.strokeStyle = rgba(state.colors.accent4, pointer.pulse * 0.42);
    context.strokeRect(pointer.x - size / 2, pointer.y - size / 2, size, size);
    pointer.pulse *= 0.92;
  }

  function draw(time = 0) {
    context.clearRect(0, 0, state.width, state.height);
    pointer.x += (pointer.targetX - pointer.x) * 0.09;
    pointer.y += (pointer.targetY - pointer.y) * 0.09;

    drawDiagonalBands(time);
    drawInteractiveGrid(time);
    drawPulse();

    state.raf = window.requestAnimationFrame(draw);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("pointermove", movePointer, { passive: true });
  window.addEventListener(
    "pointerdown",
    (event) => {
      movePointer(event);
      pointer.pulse = 1;
    },
    { passive: true }
  );
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  window.addEventListener("blur", () => {
    pointer.active = false;
  });

  new MutationObserver(() => {
    state.colors = getAmbientColors();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(state.raf);
    } else {
      resizeCanvas();
      state.raf = window.requestAnimationFrame(draw);
    }
  });

  state.raf = window.requestAnimationFrame(draw);
}

function setupInteractiveHighlights() {
  const selector = [
    ".nav-links a",
    ".nav-button",
    ".button",
    ".theme-toggle",
    ".repo-filter",
    ".project-actions a",
    ".repo-actions a",
    ".case-footer a",
    ".contact-card"
  ].join(",");

  function updatePosition(element, event) {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    element.style.setProperty("--highlight-x", `${Math.max(0, Math.min(100, x))}%`);
    element.style.setProperty("--highlight-y", `${Math.max(0, Math.min(100, y))}%`);
  }

  function bindElement(element) {
    if (element.dataset.highlightBound === "true") return;
    element.dataset.highlightBound = "true";

    element.addEventListener("pointermove", (event) => updatePosition(element, event), { passive: true });
    element.addEventListener(
      "pointerdown",
      (event) => {
        updatePosition(element, event);
        element.classList.add("is-pressing");
        window.setTimeout(() => element.classList.remove("is-pressing"), 180);
      },
      { passive: true }
    );
    element.addEventListener("pointerleave", () => {
      element.classList.remove("is-pressing");
    });
  }

  function bindInteractiveElements() {
    document.querySelectorAll(selector).forEach(bindElement);
  }

  bindInteractiveElements();

  new MutationObserver(bindInteractiveElements).observe(document.body, {
    childList: true,
    subtree: true
  });
}

function formatDate(dateString) {
  if (!dateString) return "Recently";
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric"
  }).format(new Date(dateString));
}

function getRepoMap() {
  return new Map(allRepos.map((repo) => [repo.name, repo]));
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createTagRow(tags) {
  const row = createElement("div", "tag-row");
  tags.forEach((tag) => row.append(createElement("span", "", tag)));
  return row;
}

function createActionLink(href, label) {
  const link = createElement("a", "", label);
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer";
  return link;
}

function renderFeaturedProjects() {
  const grid = document.getElementById("project-grid");
  const repoMap = getRepoMap();
  grid.replaceChildren();

  featuredProjects.forEach((project, index) => {
    const repo = repoMap.get(project.repo);
    const card = createElement("article", `project-card reveal ${project.featured ? "featured" : ""}`);
    card.style.animationDelay = `${Math.min(index * 70, 280)}ms`;

    card.append(createElement("p", "project-kicker", project.kicker));
    card.append(createElement("h3", "", project.title));
    card.append(createElement("p", "", project.summary));
    card.append(createElement("div", "project-impact", project.impact));
    card.append(createTagRow(project.tech));

    const meta = createElement("div", "project-meta");
    meta.append(createElement("span", "", repo?.language || project.tech[0]));
    meta.append(createElement("span", "", `Updated ${formatDate(repo?.pushed_at || repo?.updated_at)}`));
    meta.append(createElement("span", "", `${repo?.stargazers_count ?? 0} stars`));
    card.append(meta);

    const actions = createElement("div", "project-actions");
    actions.append(createActionLink(repo?.html_url || `https://github.com/${githubUsername}/${project.repo}`, "Repository"));
    if (repo?.homepage) actions.append(createActionLink(repo.homepage, "Live site"));
    card.append(actions);

    grid.append(card);
  });
}

function getRepoFilters() {
  const languages = [...new Set(allRepos.map((repo) => repo.language).filter(Boolean))].slice(0, 5);
  return ["Featured", "All", ...languages];
}

function getVisibleRepos() {
  const featuredNames = new Set(featuredProjects.map((project) => project.repo));
  const sorted = [...allRepos].sort((a, b) => {
    const aFeatured = featuredNames.has(a.name) ? 1 : 0;
    const bFeatured = featuredNames.has(b.name) ? 1 : 0;
    if (aFeatured !== bFeatured) return bFeatured - aFeatured;
    return new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at);
  });

  if (activeRepoFilter === "Featured") {
    const featured = sorted.filter((repo) => featuredNames.has(repo.name));
    return (featured.length ? featured : sorted).slice(0, 6);
  }

  if (activeRepoFilter === "All") return sorted.slice(0, 9);
  return sorted.filter((repo) => repo.language === activeRepoFilter).slice(0, 9);
}

function renderRepoFilters() {
  const toolbar = document.getElementById("repo-toolbar");
  toolbar.replaceChildren();

  getRepoFilters().forEach((filter) => {
    const button = createElement("button", `repo-filter ${filter === activeRepoFilter ? "active" : ""}`, filter);
    button.type = "button";
    button.addEventListener("click", () => {
      activeRepoFilter = filter;
      renderRepoFilters();
      renderRepoGrid();
    });
    toolbar.append(button);
  });
}

function renderRepoGrid() {
  const grid = document.getElementById("repo-grid");
  grid.replaceChildren();

  getVisibleRepos().forEach((repo, index) => {
    const card = createElement("article", "repo-card reveal");
    card.style.animationDelay = `${Math.min(index * 60, 240)}ms`;

    card.append(createElement("span", "", `${repo.language || "Project"} / ${formatDate(repo.pushed_at || repo.updated_at)}`));
    card.append(createElement("h3", "", repo.name.replaceAll("-", " ")));
    card.append(createElement("p", "", repo.description || "A repository from my active software portfolio."));

    const actions = createElement("div", "repo-actions");
    actions.append(createActionLink(repo.html_url, "Open repository"));
    if (repo.homepage) actions.append(createActionLink(repo.homepage, "Live site"));
    card.append(actions);

    grid.append(card);
  });
}

function updateGithubStatus(source) {
  const status = document.getElementById("github-status");
  const newest = allRepos
    .map((repo) => repo.pushed_at || repo.updated_at)
    .filter(Boolean)
    .sort()
    .at(-1);

  const sourceText = source === "live" ? "GitHub data loaded" : "Showing curated fallback data";
  status.textContent = `${sourceText}. Latest update: ${formatDate(newest)}.`;
  document.getElementById("repo-count").textContent = String(allRepos.length || 12);
}

function restoreHashScroll() {
  const id = window.location.hash.slice(1);
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ block: "start" });
  });
}

async function loadGithubRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error("GitHub request failed");
    const data = await response.json();
    allRepos = data.filter((repo) => !repo.fork && !repo.archived);
    updateGithubStatus("live");
  } catch (error) {
    allRepos = fallbackRepos;
    updateGithubStatus("fallback");
  }

  renderFeaturedProjects();
  renderRepoFilters();
  renderRepoGrid();
  restoreHashScroll();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  const dark = theme === "dark";
  const label = document.getElementById("theme-label");
  const toggle = document.getElementById("theme-toggle");
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (label) label.textContent = dark ? "Dark" : "Light";
  if (toggle) toggle.setAttribute("aria-pressed", String(dark));
  if (metaTheme) metaTheme.setAttribute("content", dark ? "#101318" : "#f5f7fa");
}

function setupThemeToggle() {
  const current = document.documentElement.dataset.theme || "dark";
  applyTheme(current);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

function removeOldServiceWorkers() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => registrations.forEach((registration) => registration.unregister()))
      .catch(() => {});
  }

  if (window.caches) {
    caches
      .keys()
      .then((keys) => keys.forEach((key) => caches.delete(key)))
      .catch(() => {});
  }
}

setupThemeToggle();
setupAmbientBackground();
setupInteractiveHighlights();
removeOldServiceWorkers();
loadGithubRepos();
