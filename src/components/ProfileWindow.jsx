import React from "react";
import { useGameState } from "../context/GameStateContext.jsx";

const ProfileWindow = () => {
  const { score, level, nextLevelXP, achievements } = useGameState();
  const percent = Math.min((score / nextLevelXP) * 100, 100).toFixed(0);

  const shareText = encodeURIComponent(
    `I reached Level ${level} on Dimitri's DevTerminal portfolio with ${score} XP and achievements: ${achievements.join(
      ", "
    )}`
  );
  const shareUrl = encodeURIComponent(window.location.href);
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&text=${shareText}`;

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

      <div>
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
