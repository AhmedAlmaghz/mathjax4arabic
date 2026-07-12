import ArabicMathJax, { installAutoSetup } from "./mathjax4arabic";

declare global {
    interface Window {
        ArabicMathJax: typeof ArabicMathJax;
    }
}

if (typeof window !== "undefined") {
    window.ArabicMathJax = ArabicMathJax;
    installAutoSetup();
}

export * from "./mathjax4arabic";
export default ArabicMathJax;
