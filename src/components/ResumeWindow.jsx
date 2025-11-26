import React from "react";

const ResumeWindow = () => {
  return (
    <div>
      <h2>Resume</h2>
      <p>
        Below is a quick interactive summary of my experience. For a full CV, use
        the download link at the bottom.
      </p>

      <section style={{ marginTop: "10px" }}>
        <h3>Experience Timeline</h3>
        <ul style={{ fontSize: "14px", marginTop: "4px" }}>
          <li>
            <strong>Software Developer</strong> – Personal Projects
            <br />
            <span style={{ fontSize: "12px", opacity: 0.8 }}>
              Web apps, games, tools, and experiments in React, C#, and more.
            </span>
          </li>
          <li style={{ marginTop: "6px" }}>
            <strong>Game Development</strong> – Asteroid Miner
            <br />
            <span style={{ fontSize: "12px", opacity: 0.8 }}>
              Procedural generation, object pooling, and performance-focused gameplay.
            </span>
          </li>
          <li style={{ marginTop: "6px" }}>
            <strong>Algorithmic Trading Project</strong>
            <br />
            <span style={{ fontSize: "12px", opacity: 0.8 }}>
              C# backtesting engine, strategy evaluation, and data visualization.
            </span>
          </li>
        </ul>
      </section>

      <section style={{ marginTop: "10px" }}>
        <h3>Key Skills</h3>
        <p style={{ fontSize: "14px" }}>
          JavaScript · React · C# · C++ · Java · Unity · Git · REST APIs
        </p>
      </section>

      <section style={{ marginTop: "10px" }}>
        <a href="/assets/resume.pdf" target="_blank" rel="noreferrer" className="btn-outline">
          Download Full CV (PDF)
        </a>
      </section>
    </div>
  );
};

export default ResumeWindow;
