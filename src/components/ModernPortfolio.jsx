import React, { useEffect, useMemo, useState } from "react";
import "../styles/modern-portfolio.css";

const GITHUB_USERNAME = "Azzurre";

const featuredFallback = [
  "LiftLens",
  "Rag",
  "World-Cup-Predictor",
  "port_scanner",
  "Weather_App",
  "TopDown"
];

const skills = [
  "React",
  "JavaScript",
  "TypeScript",
  "Python",
  "C#",
  "C++",
  "Vite",
  "GitHub",
  "Machine Learning",
  "Computer Vision",
  "Unity",
  "REST APIs"
];

const dashboardCards = [
  {
    label: "Current focus",
    value: "AI, computer vision, and polished portfolio projects",
    note: "Building interview-ready work with clear technical storytelling."
  },
  {
    label: "Main direction",
    value: "Software developer / AI developer",
    note: "Frontend, tooling, ML projects, and interactive systems."
  },
  {
    label: "Signature style",
    value: "Clean UI with practical engineering",
    note: "Minimal interfaces, smooth motion, and clear user value."
  }
];

function formatDate(dateString) {
  if (!dateString) return "Recently";
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric"
  }).format(new Date(dateString));
}

function ModernPortfolio() {
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [repoError, setRepoError] = useState("");
  const [activeFilter, setActiveFilter] = useState("Featured");

  useEffect(() => {
    let ignore = false;

    async function loadRepos() {
      try {
        setLoadingRepos(true);
        setRepoError("");
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
        );

        if (!response.ok) {
          throw new Error("GitHub request failed");
        }

        const data = await response.json();
        if (!ignore) {
          setRepos(data.filter((repo) => !repo.fork && !repo.archived));
        }
      } catch (error) {
        if (!ignore) {
          setRepoError("Could not load GitHub repositories right now.");
        }
      } finally {
        if (!ignore) setLoadingRepos(false);
      }
    }

    loadRepos();
    return () => {
      ignore = true;
    };
  }, []);

  const languages = useMemo(() => {
    const unique = new Set(repos.map((repo) => repo.language).filter(Boolean));
    return ["Featured", "All", ...Array.from(unique).slice(0, 6)];
  }, [repos]);

  const visibleRepos = useMemo(() => {
    const sorted = [...repos].sort((a, b) => {
      const aFeatured = featuredFallback.includes(a.name) ? 1 : 0;
      const bFeatured = featuredFallback.includes(b.name) ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;
      return new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at);
    });

    if (activeFilter === "Featured") {
      const featured = sorted.filter((repo) => featuredFallback.includes(repo.name));
      return (featured.length ? featured : sorted).slice(0, 6);
    }

    if (activeFilter === "All") return sorted.slice(0, 9);
    return sorted.filter((repo) => repo.language === activeFilter).slice(0, 9);
  }, [repos, activeFilter]);

  return (
    <main className="modern-shell">
      <nav className="glass-nav">
        <a className="brand-mark" href="#home" aria-label="Go to home">
          <span>D</span>
        </a>
        <div className="nav-links" aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#cv">CV</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="https://github.com/Azzurre" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </nav>

      <section id="home" className="hero-grid section-pad">
        <div className="hero-copy reveal-up">
          <p className="eyebrow">Dimitri · Software Developer · AI MSc</p>
          <h1>Modern software, AI projects, and clean interfaces that feel effortless.</h1>
          <p className="hero-subtitle">
            I build practical, user-focused systems across web development, AI experiments,
            computer vision, and game-inspired applications. This portfolio keeps the design
            minimal, fast, and recruiter-friendly while pulling live work from GitHub.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#work">View projects</a>
            <a className="secondary-button" href="#contact">Contact me</a>
          </div>
        </div>

        <aside className="hero-card reveal-up delay-1" aria-label="Portfolio snapshot">
          <div className="orb" />
          <p className="card-kicker">Personal Dashboard</p>
          <h2>Building towards developer roles in the UK and EU.</h2>
          <div className="mini-stats">
            <span><strong>{repos.length || "Live"}</strong> repos</span>
            <span><strong>AI</strong> focused</span>
            <span><strong>CV</strong> ready</span>
          </div>
        </aside>
      </section>

      <section id="work" className="section-pad projects-section">
        <div className="section-heading reveal-up">
          <p className="eyebrow">Live GitHub showcase</p>
          <h2>Projects that update as your GitHub grows.</h2>
          <p>
            Repositories are pulled directly from GitHub, sorted by recent activity, and filtered
            by technology so recruiters can quickly see what you are building.
          </p>
        </div>

        <div className="filter-row reveal-up delay-1">
          {languages.map((language) => (
            <button
              key={language}
              className={activeFilter === language ? "filter-pill active" : "filter-pill"}
              onClick={() => setActiveFilter(language)}
              type="button"
            >
              {language}
            </button>
          ))}
        </div>

        {loadingRepos && <p className="status-text">Loading GitHub projects...</p>}
        {repoError && <p className="status-text error">{repoError}</p>}

        <div className="project-grid">
          {visibleRepos.map((repo, index) => (
            <article className="project-card reveal-up" style={{ animationDelay: `${index * 70}ms` }} key={repo.id}>
              <div className="project-topline">
                <span>{repo.language || "Project"}</span>
                <span>{formatDate(repo.pushed_at || repo.updated_at)}</span>
              </div>
              <h3>{repo.name.replaceAll("-", "_")}</h3>
              <p>{repo.description || "A public project from my GitHub portfolio. More documentation can be added as the project grows."}</p>
              <div className="project-meta">
                <span>★ {repo.stargazers_count ?? 0}</span>
                <span>⑂ {repo.forks_count ?? 0}</span>
                <span>{repo.open_issues_count ?? 0} issues</span>
              </div>
              <div className="project-actions">
                <a href={repo.html_url} target="_blank" rel="noreferrer">Repository</a>
                {repo.homepage && <a href={repo.homepage} target="_blank" rel="noreferrer">Live site</a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="section-pad split-section">
        <div className="section-heading reveal-up">
          <p className="eyebrow">About me</p>
          <h2>I like turning rough ideas into polished, usable products.</h2>
        </div>
        <div className="about-panel reveal-up delay-1">
          <p>
            I am Dimitri, a software developer with a Computer Science background and an MSc in
            Artificial Intelligence. I enjoy building projects that combine clean interfaces,
            practical engineering, and a bit of creative personality.
          </p>
          <p>
            My work spans React portfolios, RAG applications, computer vision fitness tools,
            cybersecurity utilities, game prototypes, and prediction models. The goal is simple:
            build things that solve real problems and explain the engineering clearly.
          </p>
          <div className="skill-cloud">
            {skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </div>
      </section>

      <section id="dashboard" className="section-pad dashboard-section">
        <div className="section-heading reveal-up">
          <p className="eyebrow">Personal dashboard</p>
          <h2>A focused view of what matters right now.</h2>
        </div>
        <div className="dashboard-grid">
          {dashboardCards.map((card, index) => (
            <article className="dashboard-card reveal-up" style={{ animationDelay: `${index * 90}ms` }} key={card.label}>
              <p>{card.label}</p>
              <h3>{card.value}</h3>
              <span>{card.note}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="cv" className="section-pad cv-section reveal-up">
        <div>
          <p className="eyebrow">CV</p>
          <h2>Need the formal version?</h2>
          <p>
            Add your latest CV at <code>/assets/resume.pdf</code> and this button will open it instantly.
            This keeps the website simple while giving recruiters a direct route to your full profile.
          </p>
        </div>
        <a className="primary-button" href="/assets/resume.pdf" target="_blank" rel="noreferrer">Open CV</a>
      </section>

      <section id="contact" className="section-pad contact-section reveal-up">
        <p className="eyebrow">Contact</p>
        <h2>Let’s build, collaborate, or talk opportunities.</h2>
        <p>
          I am open to software, AI, frontend, and junior/graduate developer opportunities.
          Send me a message and I will get back to you.
        </p>
        <div className="contact-actions">
          <a className="primary-button" href="mailto:your.email@example.com?subject=Portfolio%20contact">Email me</a>
          <a className="secondary-button" href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </section>
    </main>
  );
}

export default ModernPortfolio;
