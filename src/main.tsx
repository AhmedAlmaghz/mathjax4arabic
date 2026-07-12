import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ArabicMathJax from "./lib/mathjax4arabic";
import App from "./App";

ArabicMathJax.configureMathJax();
ArabicMathJax.injectStyles();
ArabicMathJax.loadMathJax();
window.ArabicMathJax = ArabicMathJax;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
