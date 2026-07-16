import t, { installAutoSetup as a } from "./mathjax4arabic.js";
import { applyMathFont as i, configureMathJax as n, getMathJaxConfig as p, injectStyles as f, loadMathJax as d, preprocess as h, renderPage as s, setMathFont as x, typesetArabic as M } from "./mathjax4arabic.js";
typeof window < "u" && (window.ArabicMathJax = t, a());
export {
  i as applyMathFont,
  n as configureMathJax,
  t as default,
  p as getMathJaxConfig,
  f as injectStyles,
  a as installAutoSetup,
  d as loadMathJax,
  h as preprocess,
  s as renderPage,
  x as setMathFont,
  M as typesetArabic
};
