import ArabicMathJax from "C:/Users/AbuEmad/Downloads/update-arabic-mathjax-library/src/lib/mathjax4arabic";

const testCases = [
  "e^{i\\pi} + 1 = 0",
  "\\sum_{n=1}^{\\infty} \\frac{1}{n}",
  "P(A \\cap B) = P(A) \\cdot P(B)"
];

for (const tc of testCases) {
  console.log("-----------------------------------------");
  console.log("Input:", tc);
  const result = ArabicMathJax.preprocess(tc, { forceArabic: true });
  console.log("Output:", result);
}
