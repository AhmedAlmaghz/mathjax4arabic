import ArabicMathJax from "./arabic-mathjax";

declare global {
    interface Window {
        ArabicMathJax: typeof ArabicMathJax;
    }
}

if (typeof window !== "undefined") {
    window.ArabicMathJax = ArabicMathJax;
}

export * from "./arabic-mathjax";
export default ArabicMathJax;
