const Z = "4.1.0", w = "mjx-ar-flip";
function D() {
  try {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase().startsWith("ar");
  } catch {
    return !1;
  }
}
const s = {
  flipClass: w,
  isArabicPage: D,
  autoArabic: !0,
  mathFont: '"Amiri", "Noto Naskh Arabic", "Traditional Arabic", serif',
  digits: {
    0: "٠",
    1: "١",
    2: "٢",
    3: "٣",
    4: "٤",
    5: "٥",
    6: "٦",
    7: "٧",
    8: "٨",
    9: "٩"
  },
  decimalMark: "٫",
  thousandsMark: "٬",
  identifiers: {
    a: "ا",
    b: "ب",
    c: "جـ",
    d: "د",
    e: "هـ",
    f: "ق",
    g: "جـ",
    h: "هـ",
    k: "ك",
    l: "ل",
    m: "م",
    n: "ن",
    r: "ر",
    t: "ت",
    x: "س",
    y: "ص",
    z: "ع",
    A: "أ",
    B: "ب",
    C: "جـ",
    D: "د",
    E: "هـ",
    N: "ن",
    M: "م",
    K: "ك",
    L: "ل",
    R: "ر",
    P: "حا",
    S: "س",
    T: "ت",
    X: "س",
    Y: "ص",
    Z: "ع"
  },
  functions: {
    sin: "جا",
    cos: "جتا",
    tan: "ظا",
    cot: "ظتا",
    sec: "قا",
    csc: "قتا",
    arcsin: "قوس جا",
    arccos: "قوس جتا",
    arctan: "قوس ظا",
    arccot: "قوس ظتا",
    arccsc: "قوس قتا",
    arcsec: "قوس قا",
    sinh: "جاز",
    cosh: "جتاز",
    tanh: "ظاز",
    coth: "ظتاز",
    sech: "قاز",
    csch: "قتاز",
    log: "لـغ",
    ln: "لـو",
    lg: "لغ",
    lim: "نهـــا",
    limsup: "حد أعلى",
    liminf: "حد أدنى",
    max: "أقصى",
    min: "أدنى",
    sup: "حد أعلى",
    inf: "حد أدنى",
    sum: "مجـــــ",
    prod: "جداء",
    exp: "أس",
    det: "محدد",
    dim: "بُعد",
    ker: "نواة",
    deg: "درجة",
    arg: "سعة",
    mod: "باقي",
    gcd: "ق.م.أ",
    lcm: "م.م.أ",
    Pr: "حا"
  },
  operators: { ",": "،", ";": "؛" },
  dictionary: {
    zero: { en: "0", ar: "صفر" },
    radius: { en: "r", ar: "نق" },
    Area: { en: "A", ar: "م" },
    charge: { en: "C", ar: "ش" },
    imaginary: { en: "i", ar: "ت" },
    probability: { en: "P", ar: "حا" }
  }
};
function B(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function x(e, n) {
  return Object.keys(n || {}).forEach((a) => {
    const t = n[a];
    t && typeof t == "object" && !Array.isArray(t) && typeof e[a] == "object" ? x(e[a], t) : e[a] = t;
  }), e;
}
function A(e, n) {
  let a = 0;
  for (let t = n; t < e.length; t++) {
    if (e[t] === "\\") {
      t++;
      continue;
    }
    if (e[t] === "{") a++;
    else if (e[t] === "}" && (a--, a === 0))
      return t;
  }
  return -1;
}
function m(e, n) {
  for (; n < e.length && /\s/.test(e[n]); ) n++;
  if (e[n] !== "{") return { value: e[n] || "", end: n + 1 };
  const a = A(e, n);
  return a === -1 ? { value: e.slice(n + 1), end: e.length } : { value: e.slice(n + 1, a), end: a + 1 };
}
function b(e, n, a) {
  const t = [];
  for (let r = 0; r < a; r++) {
    const c = m(e, n);
    t.push(c.value), n = c.end;
  }
  return { args: t, end: n };
}
function _(e) {
  return typeof e?.forceArabic == "boolean" ? { isArabicPage: () => e.forceArabic } : { isArabicPage: () => s.isArabicPage() };
}
function F(e) {
  return `\\class{${s.flipClass}}{${e}}`;
}
function l(e) {
  return `\\class{${s.flipClass}}{\\text{${e}}}`;
}
function j(e) {
  return String(e).replace(/[0-9]/g, (n) => s.digits[n]).replace(/\./g, s.decimalMark).replace(/,/g, s.thousandsMark);
}
function d(e, n, a) {
  let t = "", r = 0;
  for (; r < e.length; ) {
    const c = e[r];
    if (c === "\\") {
      const i = /^\\([a-zA-Z]+)/.exec(e.slice(r));
      if (i) {
        const h = i[1], u = r + i[0].length;
        let P = !0;
        switch (h) {
          case "ar":
          case "alwaysar": {
            const o = m(e, u);
            if (h === "alwaysar" || a.isArabicPage()) {
              let g = d(o.value, !0, a);
              g = q(g), t += F(g);
            } else
              t += d(o.value, n, a);
            r = o.end;
            break;
          }
          case "fliph":
          case "mirror": {
            const o = m(e, u);
            t += F(d(o.value, !n, a)), r = o.end;
            break;
          }
          case "transx": {
            const o = b(e, u, 2);
            t += d(a.isArabicPage() ? o.args[1] : o.args[0], n, a), r = o.end;
            break;
          }
          case "transt": {
            const o = b(e, u, 2);
            a.isArabicPage() ? t += H(o.args[1], n) : t += d(o.args[0], n, a), r = o.end;
            break;
          }
          case "transs": {
            const o = b(e, u, 2);
            a.isArabicPage() ? t += o.args[1].replace(
              /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g,
              (f) => n ? l(f) : `\\text{${f}}`
            ) : t += d(o.args[0], n, a), r = o.end;
            break;
          }
          case "transn": {
            const o = m(e, u);
            if (a.isArabicPage()) {
              const f = j(o.value);
              t += n ? l(f) : `\\text{${f}}`;
            } else
              t += o.value;
            r = o.end;
            break;
          }
          case "tmfrac": {
            const o = b(e, u, 3);
            if (a.isArabicPage()) {
              const [f, g, E] = o.args.map(j), R = n ? l(f) : f, z = n ? l(g) : g, I = n ? l(E) : E;
              t += `${R}\\tfrac{${z}}{${I}}`;
            } else
              t += `${o.args[0]}\\tfrac{${o.args[1]}}{${o.args[2]}}`;
            r = o.end;
            break;
          }
          case "zero":
          case "radius":
          case "Area":
          case "charge":
          case "imaginary":
          case "probability": {
            const o = s.dictionary[h];
            o ? a.isArabicPage() ? t += n ? l(o.ar) : `\\text{${o.ar}}` : t += o.en : t += i[0], r = u;
            break;
          }
          default:
            P = !1;
        }
        if (P) continue;
        t += i[0], r = u;
        continue;
      }
    }
    if (c === "{") {
      const i = A(e, r);
      if (i === -1) {
        t += c, r++;
        continue;
      }
      t += "{" + d(e.slice(r + 1, i), n, a) + "}", r = i + 1;
      continue;
    }
    t += c, r++;
  }
  return t;
}
function q(e) {
  const n = Object.keys(s.functions).sort((a, t) => t.length - a.length);
  if (n.length) {
    const a = new RegExp(`\\\\(${n.map(B).join("|")})(?![a-zA-Z])`, "g");
    e = e.replace(a, (t, r) => `\\, ${l(s.functions[r])} \\,`);
  }
  return e = e.replace(/\d+(?:\.\d+)?/g, (a) => l(j(a))), e = N(e), e = k(e), e;
}
const v = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
function p(e, n) {
  return n ? l(e) : `\\text{${e}}`;
}
function H(e, n) {
  let a = "", t = 0;
  for (; t < e.length; ) {
    const r = e[t];
    if (/\s/.test(r)) {
      for (; t < e.length && /\s/.test(e[t]); ) t++;
      a && !a.endsWith("\\,") && (a += "\\,");
      continue;
    }
    if (r === "\\") {
      const c = /^\\([a-zA-Z]+|.)/.exec(e.slice(t));
      if (c) {
        a += c[0], t += c[0].length;
        continue;
      }
    }
    if (v.test(r)) {
      let c = t + 1;
      for (; c < e.length && v.test(e[c]); ) c++;
      a += p(e.slice(t, c), n), t = c;
      continue;
    }
    if (/\d/.test(r)) {
      const c = /^\d+(?:\.\d+)?/.exec(e.slice(t));
      if (c) {
        a += p(j(c[0]), n), t += c[0].length;
        continue;
      }
    }
    if (/[a-zA-Z]/.test(r)) {
      const c = s.identifiers[r];
      a += p(c || r, n), t++;
      continue;
    }
    a += s.operators[r] ? p(s.operators[r], n) : r, t++;
  }
  return a;
}
function N(e) {
  let n = "";
  for (let a = 0; a < e.length; a++) {
    const t = e[a];
    if (t === "\\") {
      const r = /^\\([a-zA-Z]+|.)/.exec(e.slice(a));
      if (r) {
        n += r[0], a += r[0].length - 1;
        continue;
      }
    }
    n += s.operators[t] ? l(s.operators[t]) : t;
  }
  return n;
}
function k(e) {
  let n = "", a = 0, t = !1;
  for (; a < e.length; ) {
    const r = e[a];
    if (r === "\\") {
      const c = /^\\([a-zA-Z]+|.)/.exec(e.slice(a));
      if (c) {
        if (t && (n += "\\,", t = !1), n += c[0], a += c[0].length, c[1] === "class") {
          const i = m(e, a), h = m(e, i.end);
          n += e.slice(a, h.end), a = h.end;
        } else if (c[1] === "text") {
          const i = m(e, a);
          n += e.slice(a, i.end), a = i.end;
        }
        continue;
      }
    }
    if (r === "{") {
      const c = A(e, a);
      if (c !== -1) {
        n += "{" + k(e.slice(a + 1, c)) + "}", a = c + 1, t = !1;
        continue;
      }
    }
    if (/[a-zA-Z]/.test(r)) {
      const c = s.identifiers[r];
      c ? (t && (n += "\\,"), n += l(c), t = !0) : (t && (n += "\\,", t = !1), n += r), a++;
      continue;
    }
    if (/[+\-=<>]/.test(r)) {
      t && (n += "\\,"), n += r, t = !1, a++;
      continue;
    }
    n += r, t = !1, a++;
  }
  return n;
}
function y(e, n) {
  const a = _(n);
  let t = String(e ?? "");
  return s.autoArabic && a.isArabicPage() && !t.includes("\\ar{") && !t.includes("\\alwaysar{") && (t = `\\ar{${t}}`), d(t, !1, a);
}
const O = [
  { open: "$$", close: "$$", re: /\$\$([\s\S]+?)\$\$/g },
  { open: "\\[", close: "\\]", re: /\\\[([\s\S]+?)\\\]/g },
  { open: "$", close: "$", re: /\$([^$\n]+?)\$/g },
  { open: "\\(", close: "\\)", re: /\\\(([\s\S]+?)\\\)/g }
];
function X(e, n) {
  const a = [e, n].filter((t) => typeof t == "function");
  if (a.length)
    return () => a.forEach((t) => t());
}
function J(e) {
  const n = {
    loader: { load: ["[tex]/html", "[tex]/ams"] },
    tex: {
      packages: { "[+]": ["html", "ams"] },
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]]
    },
    chtml: {
      displayAlign: "center",
      mtextInheritFont: !0,
      scale: 1.1
    },
    startup: {
      typeset: !1,
      ready: () => {
        globalThis.MathJax?.startup?.defaultReady?.();
      }
    }
  }, a = X(
    n.startup.ready,
    e?.startup?.ready
  ), t = x(n, e || {});
  return a && (t.startup.ready = a), t;
}
function W(e, n) {
  return O.reduce((a, t) => a.replace(t.re, (r, c) => `${t.open}${y(c, n)}${t.close}`), e);
}
function K(e) {
  return typeof document > "u" ? [] : e ? typeof e == "string" ? Array.from(document.querySelectorAll(e)) : e instanceof Element ? [e] : Array.from(e).filter((n) => n instanceof Element) : [document.body];
}
async function $(e, n) {
  const a = K(e);
  for (const r of a)
    r.getAttribute("data-mathjax4arabic-processed") === "true" && !n?.force || (r.innerHTML = W(r.innerHTML, n), r.setAttribute("data-mathjax4arabic-processed", "true"));
  return await globalThis.MathJax?.typesetPromise?.(a), a;
}
function U(e) {
  return $(void 0, e);
}
function S(e) {
  const n = globalThis;
  return n.MathJax = J(x(n.MathJax || {}, e || {})), n.MathJax;
}
function C(e = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js") {
  if (typeof document > "u") return Promise.resolve();
  const n = globalThis;
  if (n.MathJax?.startup?.promise) return n.MathJax.startup.promise.then(() => {
  });
  const a = document.querySelector('script[data-mathjax4arabic-loader], script[id="MathJax-script"]');
  return a ? new Promise((t, r) => {
    a.addEventListener("load", () => t(), { once: !0 }), a.addEventListener("error", () => r(new Error("Failed to load MathJax")), { once: !0 });
  }) : new Promise((t, r) => {
    const c = document.createElement("script");
    c.id = "MathJax-script", c.src = e, c.async = !0, c.dataset.mathjax4arabicLoader = "true", c.onload = () => t(), c.onerror = () => r(new Error("Failed to load MathJax")), document.head.appendChild(c);
  });
}
function V(e = {}) {
  if (typeof document > "u") return;
  L(), e.mathFont ? T(e.mathFont) : M(), S();
  const n = e.loadMathJax !== !1, a = e.autoRender !== !1, t = n ? C(e.mathJaxUrl) : Promise.resolve();
  a && t.then(() => (globalThis.MathJax?.startup?.promise ?? Promise.resolve()).then(() => $(e.target))).catch((r) => {
    console.error("[mathjax4arabic] automatic setup failed", r);
  });
}
function T(e) {
  s.mathFont = e, M(e);
}
function M(e = s.mathFont, n) {
  if (typeof document > "u") return;
  const a = n ? typeof n == "string" ? Array.from(document.querySelectorAll(n)) : [n] : [document.documentElement];
  for (const t of a)
    t.style.setProperty("--mathjax4arabic-font", e), t.classList.add("mathjax4arabic-font");
}
function L() {
  if (typeof document > "u" || document.querySelector("style[data-arabic-mathjax]")) return;
  const e = document.createElement("style");
  e.setAttribute("data-arabic-mathjax", "true"), e.textContent = `
:root {
  --mathjax4arabic-font: ${s.mathFont};
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
}`, document.head.appendChild(e);
}
const Y = {
  version: Z,
  config: s,
  preprocess: y,
  process: y,
  typesetArabic: $,
  renderPage: U,
  configureMathJax: S,
  loadMathJax: C,
  installAutoSetup: V,
  setMathFont: T,
  applyMathFont: M,
  injectStyles: L,
  getMathJaxConfig: J,
  isArabicPage: () => s.isArabicPage(),
  flipClass: w
};
export {
  M as applyMathFont,
  S as configureMathJax,
  Y as default,
  J as getMathJaxConfig,
  L as injectStyles,
  V as installAutoSetup,
  C as loadMathJax,
  y as preprocess,
  U as renderPage,
  T as setMathFont,
  $ as typesetArabic
};
