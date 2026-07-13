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

const VERSION = "4.1.0";
const FLIP_CLASS = "mjx-ar-flip";

/* ================================================================== *
 * 1. Configuration                                                    *
 * ================================================================== */

function defaultIsArabicPage(): boolean {
  try {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase().startsWith("ar");
  } catch { return false; }
}

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
  dictionary: Record<string, { en: string; ar: string }>;
}

const config: ArabicMathJaxConfig = {
  flipClass: FLIP_CLASS,
  isArabicPage: defaultIsArabicPage,
  autoArabic: true,
  mathFont: '"Amiri", "Noto Naskh Arabic", "Traditional Arabic", serif',

  digits: {
    "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤",
    "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩"
  },
  decimalMark: "\u066B",
  thousandsMark: "\u066C",

  identifiers: {
    a: "ا", b: "ب", c: "جـ", d: "د", e: "هـ",
    f: "ق", g: "جـ", h: "هـ", k: "ك", l: "ل",
    m: "م", n: "ن", r: "ر", t: "ت",
    x: "س", y: "ص", z: "ع",
    A: "أ", B: "ب", C: "جـ", D: "د", E: "هـ",
    N: "ن", M: "م", K: "ك", L: "ل", R: "ر",
    P: "حا", S: "س", T: "ت",
    X: "س", Y: "ص", Z: "ع",
  },

  functions: {
    sin: "جا", cos: "جتا", tan: "ظا", cot: "ظتا",
    sec: "قا", csc: "قتا",
    arcsin: "قوس جا", arccos: "قوس جتا", arctan: "قوس ظا",
    arccot: "قوس ظتا", arccsc: "قوس قتا", arcsec: "قوس قا",
    sinh: "جاز", cosh: "جتاز", tanh: "ظاز",
    coth: "ظتاز", sech: "قاز", csch: "قتاز",
    log: "لـغ", ln: "لـو", lg: "لغ",
    lim: "نهـــا", limsup: "حد أعلى", liminf: "حد أدنى",
    max: "أقصى", min: "أدنى",
    sup: "حد أعلى", inf: "حد أدنى",
    sum: "مجـــــ", prod: "جداء",
    exp: "أس", det: "محدد", dim: "بُعد",
    ker: "نواة", deg: "درجة", arg: "سعة",
    mod: "باقي", gcd: "ق.م.أ", lcm: "م.م.أ",
    Pr: "حا",
  },

  operators: { ",": "،", ";": "؛" },

  dictionary: {
    zero: { en: "0", ar: "صفر" },
    radius: { en: "r", ar: "نق" },
    Area: { en: "A", ar: "م" },
    charge: { en: "C", ar: "ش" },
    imaginary: { en: "i", ar: "ت" },
    probability: { en: "P", ar: "حا" },
  }
};

/* ================================================================== *
 * 2. Helpers                                                          *
 * ================================================================== */

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function deepAssign(t: Record<string, unknown>, s: Record<string, unknown>): Record<string, unknown> {
  Object.keys(s || {}).forEach(k => {
    const v = s[k];
    if (v && typeof v === "object" && !Array.isArray(v) && typeof t[k] === "object")
      deepAssign(t[k] as Record<string, unknown>, v as Record<string, unknown>);
    else t[k] = v;
  });
  return t;
}

function findBrace(str: string, open: number): number {
  let d = 0;
  for (let i = open; i < str.length; i++) {
    if (str[i] === "\\") { i++; continue; }
    if (str[i] === "{") d++;
    else if (str[i] === "}") { d--; if (d === 0) return i; }
  }
  return -1;
}

function readArg(s: string, p: number) {
  while (p < s.length && /\s/.test(s[p])) p++;
  if (s[p] !== "{") return { value: s[p] || "", end: p + 1 };
  const c = findBrace(s, p);
  if (c === -1) return { value: s.slice(p + 1), end: s.length };
  return { value: s.slice(p + 1, c), end: c + 1 };
}

function readArgs(s: string, p: number, n: number) {
  const a: string[] = [];
  for (let i = 0; i < n; i++) { const r = readArg(s, p); a.push(r.value); p = r.end; }
  return { args: a, end: p };
}

type PreprocessOptions = { forceArabic?: boolean };

export interface AutoSetupOptions {
  loadMathJax?: boolean;
  autoRender?: boolean;
  mathJaxUrl?: string;
  mathFont?: string;
  target?: string | Element | Element[] | NodeListOf<Element>;
}

interface ProcessorContext {
  isArabicPage: () => boolean;
}

function createContext(opts?: PreprocessOptions): ProcessorContext {
  if (typeof opts?.forceArabic === "boolean") {
    return { isArabicPage: () => opts.forceArabic! };
  }
  return { isArabicPage: () => config.isArabicPage() };
}

/* ── TeX Wrappers ─────────────────────────────────────────────── */

/** القلب البنيوي الخارجي */
function flip(inner: string): string {
  return `\\class{${config.flipClass}}{${inner}}`;
}

/**
 * نص عربي مُحمي من القلب:
 * يُغلَّف بقلب ثانٍ لإلغاء القلب الخارجي
 * نستخدم \text{} فقط — لا \operatorname ولا \mathop
 */
function ar(s: string): string {
  return `\\class{${config.flipClass}}{\\text{${s}}}`;
}

function mapDigits(s: string): string {
  return String(s)
    .replace(/[0-9]/g, d => config.digits[d])
    .replace(/\./g, config.decimalMark)
    .replace(/,/g, config.thousandsMark);
}

/* ================================================================== *
 * 3. TeX Processor                                                    *
 * ================================================================== */

function process(input: string, inFlip: boolean, ctx: ProcessorContext): string {
  let out = "";
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (ch === "\\") {
      const m = /^\\([a-zA-Z]+)/.exec(input.slice(i));
      if (m) {
        const name = m[1];
        const after = i + m[0].length;
        let handled = true;

        switch (name) {
          case "ar":
          case "alwaysar": {
            const a = readArg(input, after);
            const doIt = name === "alwaysar" || ctx.isArabicPage();
            if (doIt) {
              let inner = process(a.value, true, ctx);
              inner = translateAll(inner);
              out += flip(inner);
            } else {
              out += process(a.value, inFlip, ctx);
            }
            i = a.end; break;
          }

          case "fliph":
          case "mirror": {
            const a = readArg(input, after);
            out += flip(process(a.value, !inFlip, ctx));
            i = a.end; break;
          }

          case "transx": {
            const a = readArgs(input, after, 2);
            out += process(ctx.isArabicPage() ? a.args[1] : a.args[0], inFlip, ctx);
            i = a.end; break;
          }

          case "transt": {
            const a = readArgs(input, after, 2);
            if (ctx.isArabicPage()) {
              out += renderMixedText(a.args[1], inFlip);
            } else {
              out += process(a.args[0], inFlip, ctx);
            }
            i = a.end; break;
          }

          case "transs": {
            const a = readArgs(input, after, 2);
            if (ctx.isArabicPage()) {
              out += a.args[1].replace(
                /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g,
                m2 => inFlip ? ar(m2) : `\\text{${m2}}`
              );
            } else { out += process(a.args[0], inFlip, ctx); }
            i = a.end; break;
          }

          case "transn": {
            const a = readArg(input, after);
            if (ctx.isArabicPage()) {
              const mapped = mapDigits(a.value);
              out += inFlip ? ar(mapped) : `\\text{${mapped}}`;
            } else { out += a.value; }
            i = a.end; break;
          }

          case "tmfrac": {
            const a = readArgs(input, after, 3);
            if (ctx.isArabicPage()) {
              const [w, n2, d] = a.args.map(mapDigits);
              const wt = inFlip ? ar(w) : w;
              const nt = inFlip ? ar(n2) : n2;
              const dt = inFlip ? ar(d) : d;
              out += `${wt}\\tfrac{${nt}}{${dt}}`;
            } else {
              out += `${a.args[0]}\\tfrac{${a.args[1]}}{${a.args[2]}}`;
            }
            i = a.end; break;
          }

          case "zero": case "radius": case "Area":
          case "charge": case "imaginary": case "probability": {
            const entry = config.dictionary[name];
            if (entry) {
              if (ctx.isArabicPage()) {
                out += inFlip ? ar(entry.ar) : `\\text{${entry.ar}}`;
              } else { out += entry.en; }
            } else { out += m[0]; }
            i = after; break;
          }

          default: handled = false;
        }

        if (handled) continue;
        out += m[0]; i = after; continue;
      }
    }

    if (ch === "{") {
      const c = findBrace(input, i);
      if (c === -1) { out += ch; i++; continue; }
      out += "{" + process(input.slice(i + 1, c), inFlip, ctx) + "}";
      i = c + 1; continue;
    }

    out += ch; i++;
  }

  return out;
}

/* ── ترجمة كل الرموز القابلة للترجمة ─────────────────────── */

function translateAll(tex: string): string {
  // ① الدوال + المعاملات الكبيرة  (\sin → جا, \sum → مجــ, \lim → نهــا)
  const names = Object.keys(config.functions).sort((a, b) => b.length - a.length);
  if (names.length) {
    const pat = new RegExp(`\\\\(${names.map(escapeRegExp).join("|")})(?![a-zA-Z])`, "g");
    tex = tex.replace(pat, (_, fn) => {
      // مسافة + النص العربي + مسافة
      return `\\, ${ar(config.functions[fn])} \\,`;
    });
  }

  // ② الأرقام
  tex = tex.replace(/\d+(?:\.\d+)?/g, m => ar(mapDigits(m)));

  // ③ الفواصل الحقيقية فقط، مع ترك أوامر TeX مثل \, كما هي
  tex = translateOperators(tex);

  // ④ المتغيرات (حروف مفردة)
  tex = translateLetters(tex);

  return tex;
}

const ARABIC_CHAR = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

function protectedText(s: string, inFlip: boolean): string {
  return inFlip ? ar(s) : `\\text{${s}}`;
}

function renderMixedText(text: string, inFlip: boolean): string {
  let out = "";
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (/\s/.test(ch)) {
      while (i < text.length && /\s/.test(text[i])) i++;
      if (out && !out.endsWith("\\,")) out += "\\,";
      continue;
    }

    if (ch === "\\") {
      const m = /^\\([a-zA-Z]+|.)/.exec(text.slice(i));
      if (m) {
        out += m[0];
        i += m[0].length;
        continue;
      }
    }

    if (ARABIC_CHAR.test(ch)) {
      let j = i + 1;
      while (j < text.length && ARABIC_CHAR.test(text[j])) j++;
      out += protectedText(text.slice(i, j), inFlip);
      i = j;
      continue;
    }

    if (/\d/.test(ch)) {
      const m = /^\d+(?:\.\d+)?/.exec(text.slice(i));
      if (m) {
        out += protectedText(mapDigits(m[0]), inFlip);
        i += m[0].length;
        continue;
      }
    }

    if (/[a-zA-Z]/.test(ch)) {
      const mapped = config.identifiers[ch];
      out += protectedText(mapped || ch, inFlip);
      i++;
      continue;
    }

    out += config.operators[ch] ? protectedText(config.operators[ch], inFlip) : ch;
    i++;
  }

  return out;
}

function translateOperators(tex: string): string {
  let out = "";
  for (let i = 0; i < tex.length; i++) {
    const ch = tex[i];
    if (ch === "\\") {
      const m = /^\\([a-zA-Z]+|.)/.exec(tex.slice(i));
      if (m) {
        out += m[0];
        i += m[0].length - 1;
        continue;
      }
    }
    out += config.operators[ch] ? ar(config.operators[ch]) : ch;
  }
  return out;
}

function translateLetters(tex: string): string {
  let out = "";
  let i = 0;
  let prev = false; // هل الرمز السابق كان عربياً؟

  while (i < tex.length) {
    const ch = tex[i];

    // تخطي أوامر TeX، مع حماية وسائط أوامر html/text التي أنشأناها داخلياً.
    if (ch === "\\") {
      const m = /^\\([a-zA-Z]+|.)/.exec(tex.slice(i));
      if (m) {
        if (prev) { out += "\\,"; prev = false; }
        out += m[0];
        i += m[0].length;

        if (m[1] === "class") {
          const cls = readArg(tex, i);
          const body = readArg(tex, cls.end);
          out += tex.slice(i, body.end);
          i = body.end;
        } else if (m[1] === "text") {
          const body = readArg(tex, i);
          out += tex.slice(i, body.end);
          i = body.end;
        }
        continue;
      }
    }

    // ترجم محتوى المجموعات الرياضية مثل \frac{...}{...} و\sqrt{...}.
    if (ch === "{") {
      const c = findBrace(tex, i);
      if (c !== -1) {
        out += "{" + translateLetters(tex.slice(i + 1, c)) + "}";
        i = c + 1;
        prev = false;
        continue;
      }
    }

    // ترجمة حرف مفرد
    if (/[a-zA-Z]/.test(ch)) {
      const mapped = config.identifiers[ch];
      if (mapped) {
        if (prev) out += "\\,";
        out += ar(mapped);
        prev = true;
      } else {
        if (prev) { out += "\\,"; prev = false; }
        out += ch;
      }
      i++; continue;
    }

    // عمليات: مسافة
    if (/[+\-=<>]/.test(ch)) {
      if (prev) out += "\\,";
      out += ch;
      prev = false; i++; continue;
    }

    out += ch;
    prev = false; i++;
  }

  return out;
}

/* ================================================================== *
 * 4. Public API                                                       *
 * ================================================================== */

export function preprocess(tex: string, opts?: PreprocessOptions): string {
  const ctx = createContext(opts);
  let input = String(tex ?? "");
  if (config.autoArabic && ctx.isArabicPage()
    && !input.includes("\\ar{") && !input.includes("\\alwaysar{")) {
    input = `\\ar{${input}}`;
  }
  return process(input, false, ctx);
}

const MATH_DELIMITERS = [
  { open: "$$", close: "$$", re: /\$\$([\s\S]+?)\$\$/g },
  { open: "\\[", close: "\\]", re: /\\\[([\s\S]+?)\\\]/g },
  { open: "$", close: "$", re: /\$([^$\n]+?)\$/g },
  { open: "\\(", close: "\\)", re: /\\\(([\s\S]+?)\\\)/g },
];

function mergeStartupReady(baseReady: unknown, nextReady: unknown): (() => void) | undefined {
  const callbacks = [baseReady, nextReady].filter((fn): fn is () => void => typeof fn === "function");
  if (!callbacks.length) return undefined;
  return () => callbacks.forEach(fn => fn());
}

export function getMathJaxConfig(overrides?: Record<string, unknown>): Record<string, unknown> {
  const base: Record<string, unknown> = {
    loader: { load: ["[tex]/html", "[tex]/ams"] },
    tex: {
      packages: { "[+]": ["html", "ams"] },
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]]
    },
    chtml: {
      displayAlign: "center",
      mtextInheritFont: true,
      scale: 1.1
    },
    startup: {
      typeset: false,
      ready: () => {
        const mj = (globalThis as { MathJax?: { startup?: { defaultReady?: () => void } } }).MathJax;
        mj?.startup?.defaultReady?.();
      }
    }
  };

  const ready = mergeStartupReady(
    (base.startup as Record<string, unknown>).ready,
    (overrides?.startup as Record<string, unknown> | undefined)?.ready,
  );
  const merged = deepAssign(base, overrides || {});
  if (ready) (merged.startup as Record<string, unknown>).ready = ready;
  return merged;
}

function replaceDelimitedMath(html: string, opts?: PreprocessOptions): string {
  return MATH_DELIMITERS.reduce((next, delimiter) => {
    return next.replace(delimiter.re, (_whole, inner: string) => {
      return `${delimiter.open}${preprocess(inner, opts)}${delimiter.close}`;
    });
  }, html);
}

function toElements(target?: string | Element | Element[] | NodeListOf<Element>): Element[] {
  if (typeof document === "undefined") return [];
  if (!target) return [document.body];
  if (typeof target === "string") return Array.from(document.querySelectorAll(target));
  if (target instanceof Element) return [target];
  return Array.from(target).filter((el): el is Element => el instanceof Element);
}

export async function typesetArabic(
  target?: string | Element | Element[] | NodeListOf<Element>,
  opts?: PreprocessOptions & { force?: boolean },
): Promise<Element[]> {
  const elements = toElements(target);
  for (const el of elements) {
    if (el.getAttribute("data-mathjax4arabic-processed") === "true" && !opts?.force) continue;
    el.innerHTML = replaceDelimitedMath(el.innerHTML, opts);
    el.setAttribute("data-mathjax4arabic-processed", "true");
  }

  const mj = (globalThis as { MathJax?: { typesetPromise?: (elements: Element[]) => Promise<unknown> } }).MathJax;
  await mj?.typesetPromise?.(elements);
  return elements;
}

export function renderPage(opts?: PreprocessOptions & { force?: boolean }): Promise<Element[]> {
  return typesetArabic(undefined, opts);
}

export function configureMathJax(overrides?: Record<string, unknown>): Record<string, unknown> {
  const root = globalThis as { MathJax?: Record<string, unknown> };
  root.MathJax = getMathJaxConfig(deepAssign(root.MathJax || {}, overrides || {}));
  return root.MathJax;
}

export function loadMathJax(url = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js"): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const root = globalThis as { MathJax?: { startup?: { promise?: Promise<unknown> } } };
  if (root.MathJax?.startup?.promise) return root.MathJax.startup.promise.then(() => undefined);
  const existing = document.querySelector<HTMLScriptElement>('script[data-mathjax4arabic-loader], script[id="MathJax-script"]');
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load MathJax")), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "MathJax-script";
    script.src = url;
    script.async = true;
    script.dataset.mathjax4arabicLoader = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load MathJax"));
    document.head.appendChild(script);
  });
}

export function installAutoSetup(options: AutoSetupOptions = {}): void {
  if (typeof document === "undefined") return;
  injectStyles();
  if (options.mathFont) setMathFont(options.mathFont);
  else applyMathFont();
  configureMathJax();

  const load = options.loadMathJax !== false;
  const autoRender = options.autoRender !== false;
  const ready = load ? loadMathJax(options.mathJaxUrl) : Promise.resolve();
  if (!autoRender) return;
  ready.then(() => {
    const root = globalThis as { MathJax?: { startup?: { promise?: Promise<unknown> } } };
    const startup = root.MathJax?.startup?.promise ?? Promise.resolve();
    return startup.then(() => typesetArabic(options.target));
  }).catch(err => {
    console.error("[mathjax4arabic] automatic setup failed", err);
  });
}

export function setMathFont(fontFamily: string): void {
  config.mathFont = fontFamily;
  applyMathFont(fontFamily);
}

export function applyMathFont(fontFamily = config.mathFont, target?: string | Element): void {
  if (typeof document === "undefined") return;
  const elements = target
    ? (typeof target === "string" ? Array.from(document.querySelectorAll<HTMLElement>(target)) : [target as HTMLElement])
    : [document.documentElement];

  for (const el of elements) {
    el.style.setProperty("--mathjax4arabic-font", fontFamily);
    el.classList.add("mathjax4arabic-font");
  }
}

export function injectStyles(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector("style[data-arabic-mathjax]")) return;
  const style = document.createElement("style");
  style.setAttribute("data-arabic-mathjax", "true");
  style.textContent = `
:root {
  --mathjax4arabic-font: ${config.mathFont};
}
.mjx-ar-flip {
  display: inline-block !important;
  transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
}
html[lang^="ar"] mjx-container[display="true"] {
  direction: rtl;
}
.mathjax4arabic-font mjx-container,
.mathjax4arabic-font mjx-container mjx-math,
.mathjax4arabic-font mjx-container mjx-mi,
.mathjax4arabic-font mjx-container mjx-mn,
.mathjax4arabic-font mjx-container mjx-mo,
.mathjax4arabic-font mjx-container mjx-mtext,
mjx-container.mathjax4arabic-font,
mjx-container.mathjax4arabic-font mjx-math,
mjx-container.mathjax4arabic-font mjx-mi,
mjx-container.mathjax4arabic-font mjx-mn,
mjx-container.mathjax4arabic-font mjx-mo,
mjx-container.mathjax4arabic-font mjx-mtext {
  font-family: var(--mathjax4arabic-font) !important;
}`;
  document.head.appendChild(style);
}

const ArabicMathJax = {
  version: VERSION,
  config,
  preprocess,
  process: preprocess,
  typesetArabic,
  renderPage,
  configureMathJax,
  loadMathJax,
  installAutoSetup,
  setMathFont,
  applyMathFont,
  injectStyles,
  getMathJaxConfig,
  isArabicPage: () => config.isArabicPage(),
  flipClass: FLIP_CLASS
};

export default ArabicMathJax;
