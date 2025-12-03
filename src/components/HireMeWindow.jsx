import React from "react";

const HireMeWindow = () => {
  return (
    <div>
      <h2>Hire Dimitri</h2>
      <p>
        I'm a software developer who enjoys building interactive systems,
        developer tools, and rich front-end experiences like this DevTerminal.
      </p>

      <section style={{ marginTop: "8px" }}>
        <h3>What I bring</h3>
        <ul style={{ fontSize: "14px" }}>
          <li>Strong JavaScript / React foundation</li>
          <li>Game dev mindset (Unity, C#) – performance & systems thinking</li>
          <li>Experience with algorithmic trading concepts (C#)</li>
          <li>Discipline & resilience from combat sports (MMA / Muay Thai)</li>
        </ul>
      </section>

      <section style={{ marginTop: "8px" }}>
        <h3>Preferred roles</h3>
        <p style={{ fontSize: "14px" }}>
          Front-end Developer · Full-stack JavaScript · Game / Tools Developer
        </p>
      </section>

      <section style={{ marginTop: "8px" }}>
        <h3>Next steps</h3>
        <ul style={{ fontSize: "14px" }}>
          <li>View my resume via <code>open resume</code></li>
          <li>Use the Contact window or Simple Portfolio contact form</li>
          <li>Browse my GitHub via <code>github</code></li>
        </ul>
      </section>

      <section style={{ marginTop: "8px" }}>
        <a
          href="/assets/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          Download CV
        </a>
      </section>
    </div>
  );
};

export default HireMeWindow;
