import React from "react";

const AssistantWindow = () => {
  return (
    <div>
      <h2>Dev Assistant (Concept)</h2>
      <p>
        This window represents an AI assistant mode where I could integrate a
        model (like ChatGPT) via an API to answer questions about my projects,
        decisions, and code.
      </p>
      <p style={{ marginTop: "8px" }}>Example prompts you might ask:</p>
      <ul style={{ marginTop: "4px" }}>
        <li>Why did you choose React for this project?</li>
        <li>How does the XP and quest system work internally?</li>
        <li>Explain the architecture of the DevTerminal app.</li>
      </ul>
      <p style={{ marginTop: "8px", fontSize: "13px", opacity: 0.8 }}>
        In a production setup, this could call a backend endpoint that proxies
        requests to an AI API with rate-limiting, logging, and security.
      </p>
    </div>
  );
};

export default AssistantWindow;
