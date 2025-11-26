import React, { useEffect, useState } from "react";
import projectsData from "../data/projects.json";
import { useGameState } from "../context/GameStateContext.jsx";

const ProjectsWindow = ({ showToast }) => {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const { achievements, addXP, addSkillXP, registerProjectView } =
    useGameState();

  useEffect(() => {
    setProjects(projectsData);
  }, []);

  const handleSelect = p => {
    setSelected(p);
    registerProjectView && registerProjectView();

    if (addSkillXP) {
      if (p.id === "weather-app") addSkillXP("web", 10);
      if (p.id === "asteroid-miner") addSkillXP("game", 12);
      if (p.id === "algo-trader") addSkillXP("systems", 15);
    }
  };

  useEffect(() => {
    if (!selected) return;
    const hasAchievement = achievements.includes("Thorough Reader");
    if (hasAchievement) return;

    const timer = setTimeout(() => {
      if (!achievements.includes("Thorough Reader")) {
        addXP(20, "Thorough Reader");
        showToast &&
          showToast("Quest completed! +20 XP, Thorough Reader");
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [selected, achievements, addXP, showToast]);

  return (
    <div>
      <h2>Projects</h2>
      <div className="projects-list">
        {projects.map(p => (
          <div
            key={p.id}
            className="project-item"
            onClick={() => handleSelect(p)}
          >
            <strong>{p.title}</strong>
            <p>{p.short}</p>
            <p>
              <em>{p.tech.join(" · ")}</em>
            </p>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: "16px" }}>
          <h3>{selected.title}</h3>
          <p>{selected.description}</p>
          <p style={{ marginTop: "6px" }}>
            <em>{selected.tech.join(" · ")}</em>
          </p>
          <div style={{ marginTop: "6px" }}>
            {selected.github && (
              <a href={selected.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
            {selected.live && (
              <>
                {" | "}
                <a href={selected.live} target="_blank" rel="noreferrer">
                  Live Demo
                </a>
              </>
            )}
          </div>
          <p style={{ marginTop: "8px", fontSize: "12px", opacity: 0.8 }}>
            (Keep this project open for a while to unlock a secret achievement...)
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectsWindow;
