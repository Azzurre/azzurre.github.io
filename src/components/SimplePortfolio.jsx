import React from "react";
import projects from "../data/projects.json";

const SimplePortfolio = ({ onClose }) => {
  return (
    <div className="simple-portfolio-overlay">
      <div className="simple-portfolio-inner">
        <button className="btn-outline" onClick={onClose}>
          Back to DevTerminal
        </button>

        <section className="simple-section" style={{ marginTop: "16px" }}>
          <h1 className="simple-hero-title">Dimitri · Software Developer</h1>
          <p className="simple-hero-subtitle">
            Building interactive experiences, web apps, games, and tools. This is the
            simple view of my work. Switch back to DevTerminal mode for the full
            gamified experience.
          </p>
          <div className="simple-hero-buttons">
            <a href="#projects" className="btn-primary">
              View Projects
            </a>
            <a href="#contact" className="btn-outline">
              Contact Me
            </a>
          </div>
        </section>

        <section id="projects" className="simple-section">
          <h2>Featured Projects</h2>
          <div className="simple-project-grid">
            {projects.map(p => (
              <article key={p.id} className="project-item">
                {p.thumbnail && (
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    style={{ width: "100%", borderRadius: "6px", marginBottom: "6px" }}
                  />
                )}
                <strong>{p.title}</strong>
                <p>{p.short}</p>
                <p style={{ fontSize: "12px", marginTop: "4px" }}>
                  <em>{p.tech.join(" · ")}</em>
                </p>
                <div style={{ marginTop: "6px" }}>
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}
                  {p.live && (
                    <>
                      {" | "}
                      <a href={p.live} target="_blank" rel="noreferrer">
                        Live Demo
                      </a>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="simple-section">
          <h2>Contact</h2>
          <p>Want to chat about a role or project? Reach out below.</p>
          <form
            className="contact-form"
            action="https://formspree.io/f/mankpagq"
            method="POST"
          >
            <input type="text" name="name" placeholder="Your name" required />
            <input type="email" name="email" placeholder="Your email" required />
            <textarea
              name="message"
              rows="4"
              placeholder="Your message"
              required
            ></textarea>
            <button type="submit" className="btn-primary">
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default SimplePortfolio;
