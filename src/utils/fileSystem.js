export const projectsFS = {
  "/": {
    type: "dir",
    children: {
      projects: { type: "dir" },
      "about.txt": {
        type: "file",
        content:
          "I'm Dimitri, a developer who loves blending creativity with technology – from web apps and APIs to games and tooling."
      },
      "resume.pdf": {
        type: "file",
        content: "[Use 'open resume' in the terminal to view resume window.]"
      }
    }
  }
};
