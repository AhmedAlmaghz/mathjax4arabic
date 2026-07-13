/*!
 * Arabic MathJax v4.1 — Rewrite for MathJax v4.x
 *
 * المبدأ:
 * ──────
 * ① المعادلة بالكامل تُغلَّف بـ scaleX(-1)
 *    → يقلب الرموز البنيوية (∫ √ Σ ∈ ⊂ → الأقواس) تلقائياً ✓
 *
 * ② كل نص عربي يُغلَّف بـ scaleX(-1) ثانٍ → يُلغي الأول
 *    → النص العربي يظهر طبيعي غير مقلوب ✓
 *
 * ③ نستخدم فقط \text{} لكل النصوص العربية — بدون \operatorname أو \mathop
 *    → لا رموز غريبة ✓
 */
export interface ArabicMathJaxConfig {
    flipClass: string;
    isArabicPage: () => boolean;
    autoArabic: boolean;
    mathFont: string;
    digits: Record<string, string>;
    decimalMark: string;
    thousandsMark: string;
    identifiers: Record<string, string>;
    functions: Record<string, string>;
    operators: Record<string, string>;
    dictionary: Record<string, {
        en: string;
        ar: string;
    }>;
}
type PreprocessOptions = {
    forceArabic?: boolean;
};
export interface AutoSetupOptions {
    loadMathJax?: boolean;
    autoRender?: boolean;
    mathJaxUrl?: string;
    mathFont?: string;
    target?: string | Element | Element[] | NodeListOf<Element>;
}
export declare function preprocess(tex: string, opts?: PreprocessOptions): string;
export declare function getMathJaxConfig(overrides?: Record<string, unknown>): Record<string, unknown>;
export declare function typesetArabic(target?: string | Element | Element[] | NodeListOf<Element>, opts?: PreprocessOptions & {
    force?: boolean;
}): Promise<Element[]>;
export declare function renderPage(opts?: PreprocessOptions & {
    force?: boolean;
}): Promise<Element[]>;
export declare function configureMathJax(overrides?: Record<string, unknown>): Record<string, unknown>;
export declare function loadMathJax(url?: string): Promise<void>;
export declare function installAutoSetup(options?: AutoSetupOptions): void;
export declare function setMathFont(fontFamily: string): void;
export declare function applyMathFont(fontFamily?: string, target?: string | Element): void;
export declare function injectStyles(): void;
declare const ArabicMathJax: {
    version: string;
    config: ArabicMathJaxConfig;
    preprocess: typeof preprocess;
    process: typeof preprocess;
    typesetArabic: typeof typesetArabic;
    renderPage: typeof renderPage;
    configureMathJax: typeof configureMathJax;
    loadMathJax: typeof loadMathJax;
    installAutoSetup: typeof installAutoSetup;
    setMathFont: typeof setMathFont;
    applyMathFont: typeof applyMathFont;
    injectStyles: typeof injectStyles;
    getMathJaxConfig: typeof getMathJaxConfig;
    isArabicPage: () => boolean;
    flipClass: string;
};
export default ArabicMathJax;
//# sourceMappingURL=mathjax4arabic.d.ts.map