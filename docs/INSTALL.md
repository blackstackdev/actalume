# Actalume local installation

Requirements: Node.js 22 and npm.

1. Run `npm install` from the project root.
2. Run `npm run dev`.
3. Open `http://127.0.0.1:5173/`.

The interface works in ordinary browsers. Native WebMCP discovery requires a browser build that implements `document.modelContext.registerTool`; otherwise the visible app and local demo tool harness remain functional.
