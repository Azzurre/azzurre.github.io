const githubUsername = "Azzurre";

const featuredProjects = [
  {
    repo: "Rag",
    title: "Local RAG Assistant",
    kicker: "AI / retrieval",
    summary:
      "A local retrieval augmented generation project that chunks documents, stores embeddings in ChromaDB, and uses Ollama to answer questions with grounded context.",
    impact: "Shows applied AI workflow design, document retrieval, and practical Python architecture.",
    tech: ["Python", "ChromaDB", "SentenceTransformers", "Ollama"],
    featured: true
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
  },
  {
    repo: "TopDown",
    title: "Top-Down Shooter Prototype",
    kicker: "Game systems",
    summary:
      "A prototype shooter focused on enemy behaviour, movement logic, combat flow, and iterative game-feel improvements.",
    impact: "Highlights gameplay loops, systems thinking, and interactive software design.",
    tech: ["Unity", "C#", "Game AI", "Gameplay"]
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
    card.append(createElement("p", "", repo.description || "A public repository from my active software portfolio."));

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

  const sourceText = source === "live" ? "Live GitHub data loaded" : "Showing curated fallback data";
  status.textContent = `${sourceText}. Latest public update: ${formatDate(newest)}.`;
  document.getElementById("repo-count").textContent = String(allRepos.length || 12);
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
removeOldServiceWorkers();
loadGithubRepos();
