import React, { useEffect, useRef, useState } from "react";
import projects from "../data/projects.json";
import { useGameState } from "../context/GameStateContext.jsx";

const SimplePortfolio = ({ onClose }) => {
  const { visitorProfile } = useGameState();
  const overlayRef = useRef(null);
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [sectionVisibility, setSectionVisibility] = useState({
    hero: true,
    projects: false,
    skills: false,
    contact: false
  });

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
            <h2>Featured Projects</h2>
            <p>
              A selection of projects that reflect how I think about UX,
              performance, and systems design.
            </p>
          </div>
          <div className="simple-project-grid">
            {featuredProjects.map((p, idx) => (
              <article
                key={p.id}
                className={
                  "simple-project-card " +
                  (sectionVisibility.projects
                    ? "reveal-visible"
                    : "reveal")
                }
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <div className="project-header">
                  <h3>{p.title}</h3>
                  <p className="project-short">{p.short}</p>
                </div>
                <p className="project-description">{p.description}</p>
                <div className="project-tech">
                  {p.tech.map((t) => (
                    <span key={t} className="tech-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="project-links">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer">
                      Live Demo
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
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
    </div>
  );
};

export default SimplePortfolio;
