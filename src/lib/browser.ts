import ArabicMathJax from "./mathjax4arabic";

declare global {
    interface Window {
        ArabicMathJax: typeof ArabicMathJax;
    }
}

if (typeof window !== "undefined") {
    window.ArabicMathJax = ArabicMathJax;
}

export * from "./mathjax4arabic";
export default ArabicMathJax;
