import React from "react";
import { useGameState } from "../context/GameStateContext.jsx";

const ProfileWindow = () => {
  const { score, level, nextLevelXP, achievements, skillXP } =
    useGameState();
  const percent = Math.min((score / nextLevelXP) * 100, 100).toFixed(0);

  const shareText = encodeURIComponent(
    `I reached Level ${level} on Dimitri's DevTerminal portfolio with ${score} XP and achievements: ${achievements.join(
      ", "
    )}`
  );
  const shareUrl = encodeURIComponent(window.location.href);
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&text=${shareText}`;

  const renderSkillBar = (label, value) => {
    const clamped = Math.min(value, 100);
    return (
      <div style={{ marginBottom: "6px" }}>
        <div style={{ fontSize: "13px", marginBottom: "2px" }}>{label}</div>
        <div
          style={{
            height: "6px",
            background: "var(--xp-bar-bg)",
            borderRadius: "999px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${clamped}%`,
              height: "100%",
              background: "var(--xp-bar-fill)"
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>Profile &amp; Stats</h2>
      <div className="profile-summary">
        <h3>Level {level}</h3>
        <div className="profile-metrics">
          <div>
            XP: {score} / {nextLevelXP}
          </div>
          <div>Progress: {percent}%</div>
        </div>
      </div>

      <section style={{ marginTop: "10px" }}>
        <h3>Skill Breakdown (Hidden RPG)</h3>
        {renderSkillBar("Web Development", skillXP.web)}
        {renderSkillBar("Game Development", skillXP.game)}
        {renderSkillBar("Systems / Backend", skillXP.systems)}
      </section>

      <div style={{ marginTop: "12px" }}>
        <h3>Achievements</h3>
        {achievements.length === 0 ? (
          <p>
            No achievements yet. Try starting a <code>quest</code> or a{" "}
            <code>challenge</code>.
          </p>
        ) : (
          <div className="achievement-badges">
            {achievements.map(a => (
              <span key={a} className="achievement-badge">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "12px" }}>
        <a
          href={linkedInShare}
          target="_blank"
          rel="noreferrer"
          className="btn-outline"
        >
          Share achievements on LinkedIn
        </a>
      </div>
    </div>
  );
};

export default ProfileWindow;
