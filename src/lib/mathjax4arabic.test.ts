import { afterEach, describe, expect, it } from "vitest";
import ArabicMathJax, { preprocess } from "./mathjax4arabic";

const originalIsArabicPage = ArabicMathJax.config.isArabicPage;
const originalAutoArabic = ArabicMathJax.config.autoArabic;

afterEach(() => {
    ArabicMathJax.config.isArabicPage = originalIsArabicPage;
    ArabicMathJax.config.autoArabic = originalAutoArabic;
});

describe("Arabic MathJax preprocessing", () => {
    it("auto-wraps Arabic pages and translates numbers and identifiers", () => {
        ArabicMathJax.config.isArabicPage = () => true;

        const output = preprocess("x = 12");

        expect(output).toContain("\\class{mjx-ar-flip}");
        expect(output).toContain("\\text{س}");
        expect(output).toContain("\\text{١٢}");
    });

    it("does not auto-wrap non-Arabic pages", () => {
        ArabicMathJax.config.isArabicPage = () => false;

        expect(preprocess("x = 12")).toBe("x = 12");
    });

    it("supports forceArabic without mutating the global language detector", () => {
        ArabicMathJax.config.isArabicPage = () => false;

        const output = preprocess("x = 1", { forceArabic: true });

        expect(output).toContain("\\text{س}");
        expect(output).toContain("\\text{١}");
        expect(ArabicMathJax.config.isArabicPage()).toBe(false);
    });

    it("chooses bilingual math branches with transx", () => {
        expect(preprocess("\\transx{x}{س}", { forceArabic: true })).toContain("س");
        expect(preprocess("\\transx{x}{س}", { forceArabic: false })).toBe("x");
    });

    it("translates dictionary commands only in Arabic mode", () => {
        const output = preprocess("\\radius", { forceArabic: true });

        expect(output).toContain("\\text{نق}");
        expect(preprocess("\\radius", { forceArabic: false })).toBe("r");
    });

    it("does not corrupt TeX spacing commands while translating functions", () => {
        const output = preprocess("\\int_{0}^{\\pi} \\sin(x) \\, dx = 2", { forceArabic: true });

        expect(output).toContain("\\,");
        expect(output).toContain("\\text{جا}");
        expect(output).not.toContain("\\text{،}");
        expect(output).not.toContain("\\\\class");
    });

    it("translates identifiers inside TeX groups", () => {
        const output = preprocess("|z| = \\sqrt{a^2 + b^2}", { forceArabic: true });

        expect(output).toContain("\\sqrt{");
        expect(output).toContain("\\text{ع}");
        expect(output).toContain("\\text{أ}");
        expect(output).toContain("\\text{ب}");
        expect(output).not.toContain("a^");
        expect(output).not.toContain("b^");
    });

    it("translates derivative fractions without leaving Latin variables", () => {
        const output = preprocess("\\frac{d}{dx} \\ln(x) = \\frac{1}{x}", { forceArabic: true });

        expect(output).toContain("\\frac{");
        expect(output).toContain("\\text{د}");
        expect(output).toContain("\\text{س}");
        expect(output).toContain("\\text{لو}");
        expect(output).not.toContain("{d}");
        expect(output).not.toContain("{dx}");
        expect(output).not.toContain("{x}");
    });

    it("translates probability expressions nested inside fractions", () => {
        const output = preprocess("P(A|B) = \\frac{P(A \\cap B)}{P(B)}", { forceArabic: true });

        expect(output).toContain("\\cap");
        expect(output).toContain("\\text{حا}");
        expect(output).toContain("\\text{أ}");
        expect(output).toContain("\\text{ب}");
        expect(output).not.toContain("P(A");
        expect(output).not.toContain("P(B");
    });

    it("renders transt Arabic text mixed with math tokens without wrapping everything in one text node", () => {
        const output = preprocess("\\transt{\\text{where } x > 0}{حيث س > ٠}", { forceArabic: true });

        expect(output).toContain("\\text{حيث}");
        expect(output).toContain("\\text{س}");
        expect(output).toContain("\\text{٠}");
        expect(output).toContain(">");
        expect(output).not.toContain("\\text{حيث س > ٠}");
    });

    it("keeps MathJax html and ams packages in the helper config", () => {
        const config = ArabicMathJax.getMathJaxConfig();

        expect(config).toMatchObject({
            loader: { load: ["[tex]/html", "[tex]/ams"] },
            tex: { packages: { "[+]": ["html", "ams"] } },
            startup: { typeset: false },
        });
        expect(typeof (config.startup as { ready?: unknown }).ready).toBe("function");
    });

    it("exposes zero-config browser helpers", () => {
        expect(typeof ArabicMathJax.configureMathJax).toBe("function");
        expect(typeof ArabicMathJax.loadMathJax).toBe("function");
        expect(typeof ArabicMathJax.installAutoSetup).toBe("function");
        expect(typeof ArabicMathJax.renderPage).toBe("function");
        expect(typeof ArabicMathJax.typesetArabic).toBe("function");
    });
});
