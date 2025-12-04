import React, { useEffect, useState } from "react";

const GITHUB_USERNAME = "Azzurre";

const GitHubWindow = () => {
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
      .then(r => r.json())
      .then(setProfile)
      .catch(() => {});
    fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
    )
      .then(r => r.json())
      .then(setRepos)
      .catch(() => {});
  }, []);

  return (
    <div>
      <h2>GitHub Activity</h2>
      {!profile ? (
        <p>Loading GitHub profile...</p>
      ) : (
        <div style={{ marginBottom: "10px" }}>
          <strong>{profile.name || profile.login}</strong>
          <p>{profile.bio}</p>
          <p style={{ fontSize: "13px", opacity: 0.8 }}>
            Public repos: {profile.public_repos} · Followers:{" "}
            {profile.followers}
          </p>
          <a href={profile.html_url} target="_blank" rel="noreferrer">
            View GitHub Profile
          </a>
        </div>
      )}

      <h3 style={{ marginTop: "10px" }}>Recent Repositories</h3>
      {repos && repos.length ? (
        <ul style={{ marginTop: "6px" }}>
          {repos.map(repo => (
            <li key={repo.id} style={{ marginBottom: "4px" }}>
              <strong>{repo.name}</strong>{" "}
              <span style={{ fontSize: "12px", opacity: 0.8 }}>
                ({repo.language || "Unknown"})
              </span>
              <br />
              <a href={repo.html_url} target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No repositories found.</p>
      )}
    </div>
  );
};

export default GitHubWindow;
