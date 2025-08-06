import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress specific console warnings from react-quill
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("findDOMNode is deprecated") ||
      args[0].includes("DOMNodeInserted"))
  ) {
    return; // Suppress these specific warnings
  }
  originalConsoleWarn.apply(console, args);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
