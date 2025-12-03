import React, { useEffect, useRef, useState } from "react";
import projects from "../data/projects.json";
import { useGameState } from "../context/GameStateContext.jsx";
import { useGithubRepos } from "../hooks/useGithubRepos.js";
import { useGithubRepoDetails } from "../hooks/useGithubRepoDetails";


const SimplePortfolio = ({ onClose }) => {
  const { visitorProfile } = useGameState();
  const overlayRef = useRef(null);
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);
  const sliderRef = useRef(null);

const scrollSliderBy = (direction) => {
  const container = sliderRef.current;
  if (!container) return;

  const firstChild = container.firstChild;
  const cardWidth = firstChild
    ? firstChild.getBoundingClientRect().width + 16 // card + gap
    : 280;

  container.scrollBy({
    left: direction * cardWidth,
    behavior: "smooth"
  });
};

const [activeRepo, setActiveRepo] = useState(null);
const [showRepoModal, setShowRepoModal] = useState(false);

const { repos, loading: reposLoading, error: reposError } = useGithubRepos("Azzurre");
const githubProjects = repos;

const RepoBreakdownModal = ({ repo, onClose }) => {
  const { details, loading, error } = useGithubRepoDetails(repo);

  const fullName = repo.full_name || `${repo.owner?.login}/${repo.name}`;
  const primaryLang =
    (details?.languages && details.languages[0]?.lang) || repo.language;

  return (
    <div className="repo-modal-backdrop" onClick={onClose}>
      <div
        className="repo-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="repo-modal-header">
          <div>
            <h3>{repo.name}</h3>
            <p className="repo-subtitle">{fullName}</p>
          </div>
          <button
            type="button"
            className="repo-close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="repo-modal-body">
          <section className="repo-section">
            <h4>Overview</h4>
            {loading && <p>Loading breakdown…</p>}
            {error && (
              <p className="repo-error">
                Could not load extra details. ({error})
              </p>
            )}
            {!loading && !error && (
              <>
                {details?.summary ? (
                  <p>{details.summary}</p>
                ) : repo.description ? (
                  <p>{repo.description}</p>
                ) : (
                  <p>
                    This project does not have a detailed README yet, but you
                    can explore the code on GitHub.
                  </p>
                )}
              </>
            )}
          </section>

          {/* Full README */}
          {!loading && !error && details?.readme && (
            <section className="repo-section">
              <h4>Full README</h4>
              <div className="repo-readme">
                <pre>{details.readme}</pre>
              </div>
            </section>
          )}


          <section className="repo-section">
            <h4>Tech &amp; Languages</h4>
            <div className="repo-tags">
              {primaryLang && (
                <span className="tech-tag primary">
                  {primaryLang}
                </span>
              )}
              {details?.languages &&
                details.languages.slice(0, 5).map((l) => (
                  <span key={l.lang} className="tech-tag">
                    {l.lang}
                  </span>
                ))}
            </div>
          </section>

          <section className="repo-section">
            <h4>Activity &amp; Stats</h4>
            <div className="repo-stats-grid">
              <div className="repo-stat">
                <span className="label">Stars</span>
                <span className="value">
                  {repo.stargazers_count ?? 0}
                </span>
              </div>
              <div className="repo-stat">
                <span className="label">Forks</span>
                <span className="value">
                  {repo.forks_count ?? 0}
                </span>
              </div>
              <div className="repo-stat">
                <span className="label">Issues</span>
                <span className="value">
                  {repo.open_issues_count ?? 0}
                </span>
              </div>
              <div className="repo-stat">
                <span className="label">Last activity</span>
                <span className="value">
                  {repo.pushed_at
                    ? new Date(repo.pushed_at).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )
                    : "—"}
                </span>
              </div>
            </div>
          </section>

          <section className="repo-section">
            <h4>Links</h4>
            <div className="repo-links">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
              {repo.homepage && (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open live project
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const [scrollProgress, setScrollProgress] = useState(0);
const [activeSection, setActiveSection] = useState("hero");
const [sectionVisibility, setSectionVisibility] = useState({
  hero: true,
  projects: false,
  skills: false,
  contact: false
});

const openRepoModal = (repo) => {
  setActiveRepo(repo);
  setShowRepoModal(true);
};

const closeRepoModal = () => {
  setShowRepoModal(false);
  setActiveRepo(null);
};


  const profileText =
    visitorProfile === "power"
      ? "You seem to enjoy the technical side of things. This view gives you a fast, high-level snapshot of who I am as a developer."
      : visitorProfile === "visual"
      ? "Here's a clean, visual overview of my experience, key projects, and how to contact me."
      : "A focused, recruiter-friendly view of my skills, experience, and featured work.";

  const featuredProjects = projects.slice(0, 3);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const getSectionRect = (ref) => {
      if (!ref.current) return null;
      const rect = ref.current.getBoundingClientRect();
      const containerRect = el.getBoundingClientRect();
      return {
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
        height: rect.height,
        containerHeight: containerRect.height
      };
    };

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      const pct = max > 0 ? (scrollTop / max) * 100 : 0;
      setScrollProgress(pct);

      const sections = [
        { id: "hero", ref: heroRef },
        { id: "projects", ref: projectsRef },
        { id: "skills", ref: skillsRef },
        { id: "contact", ref: contactRef }
      ];

      let bestId = "hero";
      let bestScore = Infinity;
      const visibleState = {
        hero: false,
        projects: false,
        skills: false,
        contact: false
      };

      sections.forEach(({ id, ref }) => {
        const r = getSectionRect(ref);
        if (!r) return;

        const center = r.top + r.height / 2;
        const containerCenter = r.containerHeight / 2;
        const dist = Math.abs(center - containerCenter);

        if (dist < bestScore) {
          bestScore = dist;
          bestId = id;
        }

        // mark visible if any part of section is within 80% of viewport height
        const visibleTop = r.containerHeight * 0.1;
        const visibleBottom = r.containerHeight * 0.9;
        const sectionTopInView = r.top < visibleBottom;
        const sectionBottomInView = r.bottom > visibleTop;

        if (sectionTopInView && sectionBottomInView) {
          visibleState[id] = true;
        }
      });

      setActiveSection(bestId);
      setSectionVisibility(visibleState);
    };

    // Initial pass
    handleScroll();
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const sectionClass = (base, id) => {
    const visible = sectionVisibility[id];
    const revealClass = visible ? "reveal-visible" : "reveal";
    const activeClass = activeSection === id ? " section-active" : "";
    return `${base} ${revealClass}${activeClass}`;
  };

  return (
    <div className="simple-portfolio-overlay" ref={overlayRef}>
      <div
        className="simple-scroll-bar"
        style={{ width: `${scrollProgress}%` }}
      />
      <div className="simple-portfolio-inner">
        {/* Top bar */}
        <header className="simple-header reveal-visible">
          <div className="simple-logo-block">
            <div className="simple-logo-dot" />
            <span className="simple-logo-text">Dimitri</span>
            <span className="simple-logo-sub">Software Developer</span>
          </div>
          <div className="simple-header-actions">
            <a
              href="/assets/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn-small primary"
            >
              Download CV
            </a>
            <a
              href="https://github.com/Azzurre"
              target="_blank"
              rel="noreferrer"
              className="btn-small ghost"
            >
              GitHub
            </a>
            <button className="btn-small ghost" onClick={onClose}>
              Back to DevTerminal
            </button>
          </div>
        </header>

        {/* Hero */}
        <section
          ref={heroRef}
          className={sectionClass("simple-section hero", "hero")}
          id="hero"
        >
          <div className="hero-main">
            <h1 className="simple-hero-title">
              Building thoughtful{" "}
              <span className="accent-pill">
                web &amp; software experiences
              </span>
            </h1>
            <p className="simple-hero-subtitle">{profileText}</p>
            <div className="simple-hero-badges">
              <span className="badge-soft">
                Front-end · React · TypeScript / JavaScript
              </span>
              <span className="badge-soft">
                C# / C++ · Game &amp; systems thinking
              </span>
              <span className="badge-soft">
                Looking at roles in EU/UK remote or hybrid
              </span>
            </div>
          </div>
          <div className="hero-sidecard">
            <h3>Quick Snapshot</h3>
            <ul>
              <li>
                <span className="label">Focus</span>
                <span className="value">
                  Front-end, tooling, and game-inspired systems
                </span>
              </li>
              <li>
                <span className="label">Strengths</span>
                <span className="value">
                  Clean UX, performance awareness, ownership mindset
                </span>
              </li>
              <li>
                <span className="label">Industries</span>
                <span className="value">
                  SaaS, dev tools, fintech, gaming / interactive
                </span>
              </li>
            </ul>
          </div>
        </section>

{/* Projects */}
<section
  ref={projectsRef}
  id="projects"
  className={sectionClass("simple-section", "projects")}
>
  <div className="section-header">
    <h2>GitHub Projects</h2>
    <p>
      A live view of my public repositories on GitHub. Scroll sideways to
      explore more of what I&apos;ve been building.
    </p>
  </div>

  {reposLoading && (
    <p style={{ fontSize: "13px", opacity: 0.8 }}>Loading projects…</p>
  )}

  {reposError && (
    <p style={{ fontSize: "13px", color: "#f97373", opacity: 0.9 }}>
      Could not load GitHub projects right now.
    </p>
  )}

  {!reposLoading && !reposError && githubProjects.length > 0 && (
    <div className="project-slider-wrapper">
      <button
        type="button"
        className="slider-arrow left"
        onClick={() => scrollSliderBy(-1)}
        aria-label="Scroll projects left"
      >
        ‹
      </button>

      <div className="simple-project-slider" ref={sliderRef}>
        {githubProjects.map((repo, idx) => (
          <article
            key={repo.id}
            className={
              "simple-project-card " +
              (sectionVisibility.projects ? "reveal-visible" : "reveal")
            }
            style={{ transitionDelay: `${idx * 40}ms` }}
          >
            <div className="project-header">
              <h3>{repo.name}</h3>
              {repo.language && (
                <p className="project-short">{repo.language}</p>
              )}
            </div>

            {repo.description && (
              <p className="project-description">{repo.description}</p>
            )}

            <div className="project-tech">
              {repo.language && (
                <span className="tech-tag">{repo.language}</span>
              )}
              {repo.stargazers_count > 0 && (
                <span className="tech-tag">★ {repo.stargazers_count}</span>
              )}
              {repo.updated_at && (
                <span className="tech-tag">
                  updated{" "}
                  {new Date(repo.updated_at).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric"
                  })}
                </span>
              )}
            </div>

            <div className="project-links">
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                GitHub
              </a>
              {repo.homepage && (
                <a href={repo.homepage} target="_blank" rel="noreferrer">
                  Live
                </a>
              )}
              <button
                type = "button"
                className="project-breakdown-btn"
                onClick={() => openRepoModal(repo)}
                > 
                View breakdown
                </button>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="slider-arrow right"
        onClick={() => scrollSliderBy(1)}
        aria-label="Scroll projects right"
      >
        ›
      </button>
    </div>
  )}
</section>

        {/* Skills */}
        <section
          ref={skillsRef}
          className={sectionClass("simple-section", "skills")}
          id="skills"
        >
          <div className="section-header">
            <h2>Skills &amp; Tooling</h2>
            <p>
              I’m comfortable owning features end-to-end – from idea and
              iteration, through implementation, to polish and maintenance.
            </p>
          </div>
          <div className="simple-skills-grid">
            <div
              className={
                "simple-card " +
                (sectionVisibility.skills ? "reveal-visible" : "reveal")
              }
            >
              <h3>Languages &amp; Front-end</h3>
              <p>
                JavaScript · TypeScript · React · HTML · CSS · modern UI
                patterns · SPA architecture
              </p>
            </div>
            <div
              className={
                "simple-card " +
                (sectionVisibility.skills ? "reveal-visible" : "reveal")
              }
            >
              <h3>Backend &amp; Systems</h3>
              <p>C# · .NET · Node.js (basic) · REST APIs · data-driven design</p>
            </div>
            <div
              className={
                "simple-card " +
                (sectionVisibility.skills ? "reveal-visible" : "reveal")
              }
            >
              <h3>Game &amp; Performance</h3>
              <p>
                Unity · C# · procedural generation · object pooling ·
                performance-aware code and profiling.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          ref={contactRef}
          id="contact"
          className={sectionClass("simple-section contact-section", "contact")}
        >
          <div className="section-header">
            <h2>Let’s talk</h2>
            <p>
              Whether you&apos;re hiring for a role or exploring collaboration,
              I&apos;m happy to connect and share more details or code samples.
            </p>
          </div>
          <div className="contact-grid">
            <div
              className={
                "simple-card contact-copy " +
                (sectionVisibility.contact ? "reveal-visible" : "reveal")
              }
            >
              <h3>What I&apos;m looking for</h3>
              <p>
                Roles where I can contribute to meaningful products, collaborate
                with other engineers, and continue growing both technically and
                as a teammate.
              </p>
              <p style={{ marginTop: "8px" }}>
                I respond quickly to emails and I&apos;m open to remote,
                hybrid, or on-site opportunities depending on location.
              </p>
            </div>
            <div
              className={
                "simple-card contact-form-card " +
                (sectionVisibility.contact ? "reveal-visible" : "reveal")
              }
            >
              <form
                className="contact-form"
                action="https://formspree.io/f/mankpagq"
                method="POST"
              >
                <div className="form-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject (e.g. Front-end role, project idea)"
                  required
                />
                <textarea
                  name="message"
                  rows="4"
                  placeholder="How can I help? Feel free to share a short summary of the role or project."
                  required
                ></textarea>
                <button type="submit" className="btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="simple-footer reveal-visible">
          <span>
            © {new Date().getFullYear()} Dimitri · DevTerminal Portfolio
          </span>
          <span className="footer-note">
            Tip: Use Recruiter Mode or this view for the most streamlined
            experience.
          </span>
        </footer>
      </div>
      {showRepoModal && activeRepo && (
  <RepoBreakdownModal repo={activeRepo} onClose={closeRepoModal} />
)}
    </div>
  );
};

export default SimplePortfolio;
