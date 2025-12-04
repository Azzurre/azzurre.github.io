import { useEffect, useState } from "react";

export function useGithubRepos(username) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        );

        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status}`);
        }

        const data = await res.json();
        if (cancelled) return;

        // ✅ use the same variable name consistently
        const filtered = data
          .filter((repo) => !repo.fork)
          .sort(
            (a, b) =>
              new Date(b.pushed_at).getTime() -
              new Date(a.pushed_at).getTime()
          );

        setRepos(filtered);
      } catch (err) {
        if (!cancelled) {
          console.error("GitHub repos fetch error:", err);
          setError(err.message || "Failed to load GitHub repos");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [username]);

  return { repos, loading, error };
}
