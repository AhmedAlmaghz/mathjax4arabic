import ArabicMathJax from "./mathjax4arabic";
declare global {
    interface Window {
        ArabicMathJax: typeof ArabicMathJax;
    }
}
export * from "./mathjax4arabic";
export default ArabicMathJax;
//# sourceMappingURL=browser.d.ts.map