import { useEffect, useState } from "react";

export function useGithubRepoDetails(repo) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!repo) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const fullName = repo.full_name; // e.g. "Azzurre/my-repo"
        if (!fullName) {
          throw new Error("Missing repo full_name");
        }

        const [owner, name] = fullName.split("/");

        // ✅ NOTE: this must be `langsRes` and used as `langsRes` below
        const [readmeRes, langsRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${owner}/${name}/readme`),
          fetch(`https://api.github.com/repos/${owner}/${name}/languages`)
        ]);

        let readmeText = "";
        if (readmeRes.ok) {
          const readmeJson = await readmeRes.json();
          if (readmeJson && readmeJson.content) {
            try {
              // README content is base64 encoded
              readmeText = atob(readmeJson.content.replace(/\s/g, ""));
            } catch (e) {
              console.warn("Failed to decode README", e);
            }
          }
        }

        let languages = {};
        if (langsRes.ok) {
          languages = await langsRes.json();
        }

        if (cancelled) return;

        // Build a simple summary: first 3 non-empty non-heading lines
        const lines = readmeText
          .split("\n")
          .map((l) => l.trim())
          .filter(
            (l) =>
              l.length > 0 &&
              !l.toLowerCase().startsWith("#") &&
              !l.toLowerCase().startsWith("<!")
          );

        const summary = lines.slice(0, 3).join(" ");

        // Sort languages by bytes descending
        const languageList = Object.entries(languages)
          .sort((a, b) => b[1] - a[1])
          .map(([lang, bytes]) => ({ lang, bytes }));

        setDetails({
          summary,
          readme: readmeText,
          languages: languageList
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Github repo details fetch error:", err);
          setError(err.message || "Failed to load repo details");
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
  }, [repo]);

  return { details, loading, error };
}
