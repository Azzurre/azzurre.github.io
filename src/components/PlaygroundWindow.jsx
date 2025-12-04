import React, { useState } from "react";

const defaultSnippet = `// Type JavaScript here and click Run
const message = "Hello from the playground!";
message;`;

const PlaygroundWindow = () => {
  const [code, setCode] = useState(defaultSnippet);
  const [result, setResult] = useState("");

  const runCode = () => {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(code);
      const output = fn();
      setResult(String(output));
    } catch (err) {
      setResult("Error: " + err.message);
    }
  };

  return (
    <div>
      <h2>Live Code Playground</h2>
      <p style={{ fontSize: "13px", opacity: 0.8 }}>
        A simple JavaScript playground to experiment with snippets.
      </p>
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        rows={10}
        style={{
          width: "100%",
          background: "#111",
          color: "#f5f5f5",
          borderRadius: "6px",
          border: "1px solid #444",
          padding: "8px",
          fontFamily: "monospace",
          fontSize: "13px"
        }}
      />
      <button
        onClick={runCode}
        className="btn-primary"
        style={{ marginTop: "8px" }}
      >
        Run
      </button>
      <div
        style={{
          marginTop: "10px",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #444",
          background: "#050505",
          fontFamily: "monospace",
          fontSize: "13px"
        }}
      >
        <strong>Result:</strong>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "4px" }}>
          {result}
        </pre>
      </div>
    </div>
  );
};

export default PlaygroundWindow;
