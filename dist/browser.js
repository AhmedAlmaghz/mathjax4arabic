const I = "4.1.0", x = "mjx-ar-flip";
function Z() {
  try {
    return (document.documentElement.getAttribute("lang") || "").toLowerCase().startsWith("ar");
  } catch {
    return !1;
  }
}
const o = {
  flipClass: x,
  isArabicPage: Z,
  autoArabic: !0,
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
    a: "أ",
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
    log: "لغ",
    ln: "لو",
    lg: "لغ",
    lim: "نهــا",
    limsup: "حد أعلى",
    liminf: "حد أدنى",
    max: "أقصى",
    min: "أدنى",
    sup: "حد أعلى",
    inf: "حد أدنى",
    sum: "مجــ",
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
function D(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function $(e, r) {
  return Object.keys(r || {}).forEach((a) => {
    const t = r[a];
    t && typeof t == "object" && !Array.isArray(t) && typeof e[a] == "object" ? $(e[a], t) : e[a] = t;
  }), e;
}
function M(e, r) {
  let a = 0;
  for (let t = r; t < e.length; t++) {
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
function h(e, r) {
  for (; r < e.length && /\s/.test(e[r]); ) r++;
  if (e[r] !== "{") return { value: e[r] || "", end: r + 1 };
  const a = M(e, r);
  return a === -1 ? { value: e.slice(r + 1), end: e.length } : { value: e.slice(r + 1, a), end: a + 1 };
}
function p(e, r, a) {
  const t = [];
  for (let n = 0; n < a; n++) {
    const s = h(e, r);
    t.push(s.value), r = s.end;
  }
  return { args: t, end: r };
}
function B(e) {
  return typeof e?.forceArabic == "boolean" ? { isArabicPage: () => e.forceArabic } : { isArabicPage: () => o.isArabicPage() };
}
function E(e) {
  return `\\class{${o.flipClass}}{${e}}`;
}
function l(e) {
  return `\\class{${o.flipClass}}{\\text{${e}}}`;
}
function y(e) {
  return String(e).replace(/[0-9]/g, (r) => o.digits[r]).replace(/\./g, o.decimalMark).replace(/,/g, o.thousandsMark);
}
function d(e, r, a) {
  let t = "", n = 0;
  for (; n < e.length; ) {
    const s = e[n];
    if (s === "\\") {
      const i = /^\\([a-zA-Z]+)/.exec(e.slice(n));
      if (i) {
        const m = i[1], u = n + i[0].length;
        let w = !0;
        switch (m) {
          case "ar":
          case "alwaysar": {
            const c = h(e, u);
            if (m === "alwaysar" || a.isArabicPage()) {
              let g = d(c.value, !0, a);
              g = _(g), t += E(g);
            } else
              t += d(c.value, r, a);
            n = c.end;
            break;
          }
          case "fliph":
          case "mirror": {
            const c = h(e, u);
            t += E(d(c.value, !r, a)), n = c.end;
            break;
          }
          case "transx": {
            const c = p(e, u, 2);
            t += d(a.isArabicPage() ? c.args[1] : c.args[0], r, a), n = c.end;
            break;
          }
          case "transt": {
            const c = p(e, u, 2);
            a.isArabicPage() ? t += H(c.args[1], r) : t += d(c.args[0], r, a), n = c.end;
            break;
          }
          case "transs": {
            const c = p(e, u, 2);
            a.isArabicPage() ? t += c.args[1].replace(
              /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g,
              (f) => r ? l(f) : `\\text{${f}}`
            ) : t += d(c.args[0], r, a), n = c.end;
            break;
          }
          case "transn": {
            const c = h(e, u);
            if (a.isArabicPage()) {
              const f = y(c.value);
              t += r ? l(f) : `\\text{${f}}`;
            } else
              t += c.value;
            n = c.end;
            break;
          }
          case "tmfrac": {
            const c = p(e, u, 3);
            if (a.isArabicPage()) {
              const [f, g, j] = c.args.map(y), L = r ? l(f) : f, R = r ? l(g) : g, z = r ? l(j) : j;
              t += `${L}\\tfrac{${R}}{${z}}`;
            } else
              t += `${c.args[0]}\\tfrac{${c.args[1]}}{${c.args[2]}}`;
            n = c.end;
            break;
          }
          case "zero":
          case "radius":
          case "Area":
          case "charge":
          case "imaginary":
          case "probability": {
            const c = o.dictionary[m];
            c ? a.isArabicPage() ? t += r ? l(c.ar) : `\\text{${c.ar}}` : t += c.en : t += i[0], n = u;
            break;
          }
          default:
            w = !1;
        }
        if (w) continue;
        t += i[0], n = u;
        continue;
      }
    }
    if (s === "{") {
      const i = M(e, n);
      if (i === -1) {
        t += s, n++;
        continue;
      }
      t += "{" + d(e.slice(n + 1, i), r, a) + "}", n = i + 1;
      continue;
    }
    t += s, n++;
  }
  return t;
}
function _(e) {
  const r = Object.keys(o.functions).sort((a, t) => t.length - a.length);
  if (r.length) {
    const a = new RegExp(`\\\\(${r.map(D).join("|")})(?![a-zA-Z])`, "g");
    e = e.replace(a, (t, n) => `\\, ${l(o.functions[n])} \\,`);
  }
  return e = e.replace(/\d+(?:\.\d+)?/g, (a) => l(y(a))), e = O(e), e = J(e), e;
}
const v = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
function b(e, r) {
  return r ? l(e) : `\\text{${e}}`;
}
function H(e, r) {
  let a = "", t = 0;
  for (; t < e.length; ) {
    const n = e[t];
    if (/\s/.test(n)) {
      for (; t < e.length && /\s/.test(e[t]); ) t++;
      a && !a.endsWith("\\,") && (a += "\\,");
      continue;
    }
    if (n === "\\") {
      const s = /^\\([a-zA-Z]+|.)/.exec(e.slice(t));
      if (s) {
        a += s[0], t += s[0].length;
        continue;
      }
    }
    if (v.test(n)) {
      let s = t + 1;
      for (; s < e.length && v.test(e[s]); ) s++;
      a += b(e.slice(t, s), r), t = s;
      continue;
    }
    if (/\d/.test(n)) {
      const s = /^\d+(?:\.\d+)?/.exec(e.slice(t));
      if (s) {
        a += b(y(s[0]), r), t += s[0].length;
        continue;
      }
    }
    if (/[a-zA-Z]/.test(n)) {
      const s = o.identifiers[n];
      a += b(s || n, r), t++;
      continue;
    }
    a += o.operators[n] ? b(o.operators[n], r) : n, t++;
  }
  return a;
}
function O(e) {
  let r = "";
  for (let a = 0; a < e.length; a++) {
    const t = e[a];
    if (t === "\\") {
      const n = /^\\([a-zA-Z]+|.)/.exec(e.slice(a));
      if (n) {
        r += n[0], a += n[0].length - 1;
        continue;
      }
    }
    r += o.operators[t] ? l(o.operators[t]) : t;
  }
  return r;
}
function J(e) {
  let r = "", a = 0, t = !1;
  for (; a < e.length; ) {
    const n = e[a];
    if (n === "\\") {
      const s = /^\\([a-zA-Z]+|.)/.exec(e.slice(a));
      if (s) {
        if (t && (r += "\\,", t = !1), r += s[0], a += s[0].length, s[1] === "class") {
          const i = h(e, a), m = h(e, i.end);
          r += e.slice(a, m.end), a = m.end;
        } else if (s[1] === "text") {
          const i = h(e, a);
          r += e.slice(a, i.end), a = i.end;
        }
        continue;
      }
    }
    if (n === "{") {
      const s = M(e, a);
      if (s !== -1) {
        r += "{" + J(e.slice(a + 1, s)) + "}", a = s + 1, t = !1;
        continue;
      }
    }
    if (/[a-zA-Z]/.test(n)) {
      const s = o.identifiers[n];
      s ? (t && (r += "\\,"), r += l(s), t = !0) : (t && (r += "\\,", t = !1), r += n), a++;
      continue;
    }
    if (/[+\-=<>]/.test(n)) {
      t && (r += "\\,"), r += n, t = !1, a++;
      continue;
    }
    r += n, t = !1, a++;
  }
  return r;
}
function A(e, r) {
  const a = B(r);
  let t = String(e ?? "");
  return o.autoArabic && a.isArabicPage() && !t.includes("\\ar{") && !t.includes("\\alwaysar{") && (t = `\\ar{${t}}`), d(t, !1, a);
}
const q = [
  { open: "$$", close: "$$", re: /\$\$([\s\S]+?)\$\$/g },
  { open: "\\[", close: "\\]", re: /\\\[([\s\S]+?)\\\]/g },
  { open: "$", close: "$", re: /\$([^$\n]+?)\$/g },
  { open: "\\(", close: "\\)", re: /\\\(([\s\S]+?)\\\)/g }
];
function X(e, r) {
  const a = [e, r].filter((t) => typeof t == "function");
  if (a.length)
    return () => a.forEach((t) => t());
}
function k(e) {
  const r = {
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
    r.startup.ready,
    e?.startup?.ready
  ), t = $(r, e || {});
  return a && (t.startup.ready = a), t;
}
function N(e, r) {
  return q.reduce((a, t) => a.replace(t.re, (n, s) => `${t.open}${A(s, r)}${t.close}`), e);
}
function W(e) {
  return typeof document > "u" ? [] : e ? typeof e == "string" ? Array.from(document.querySelectorAll(e)) : e instanceof Element ? [e] : Array.from(e).filter((r) => r instanceof Element) : [document.body];
}
async function P(e, r) {
  const a = W(e);
  for (const n of a)
    n.getAttribute("data-mathjax4arabic-processed") === "true" && !r?.force || (n.innerHTML = N(n.innerHTML, r), n.setAttribute("data-mathjax4arabic-processed", "true"));
  return await globalThis.MathJax?.typesetPromise?.(a), a;
}
function K(e) {
  return P(void 0, e);
}
function S(e) {
  const r = globalThis;
  return r.MathJax = k($(r.MathJax || {}, e || {})), r.MathJax;
}
function C(e = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js") {
  if (typeof document > "u") return Promise.resolve();
  const r = globalThis;
  if (r.MathJax?.startup?.promise) return r.MathJax.startup.promise.then(() => {
  });
  const a = document.querySelector('script[data-mathjax4arabic-loader], script[id="MathJax-script"]');
  return a ? new Promise((t, n) => {
    a.addEventListener("load", () => t(), { once: !0 }), a.addEventListener("error", () => n(new Error("Failed to load MathJax")), { once: !0 });
  }) : new Promise((t, n) => {
    const s = document.createElement("script");
    s.id = "MathJax-script", s.src = e, s.async = !0, s.dataset.mathjax4arabicLoader = "true", s.onload = () => t(), s.onerror = () => n(new Error("Failed to load MathJax")), document.head.appendChild(s);
  });
}
function F(e = {}) {
  if (typeof document > "u") return;
  T(), S();
  const r = e.loadMathJax !== !1, a = e.autoRender !== !1, t = r ? C(e.mathJaxUrl) : Promise.resolve();
  a && t.then(() => (globalThis.MathJax?.startup?.promise ?? Promise.resolve()).then(() => P(e.target))).catch((n) => {
    console.error("[mathjax4arabic] automatic setup failed", n);
  });
}
function T() {
  if (typeof document > "u" || document.querySelector("style[data-arabic-mathjax]")) return;
  const e = document.createElement("style");
  e.setAttribute("data-arabic-mathjax", "true"), e.textContent = `
.mjx-ar-flip {
  display: inline-block !important;
  transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
}
html[lang^="ar"] mjx-container[display="true"] {
  direction: rtl;
}`, document.head.appendChild(e);
}
const U = {
  version: I,
  config: o,
  preprocess: A,
  process: A,
  typesetArabic: P,
  renderPage: K,
  configureMathJax: S,
  loadMathJax: C,
  installAutoSetup: F,
  injectStyles: T,
  getMathJaxConfig: k,
  isArabicPage: () => o.isArabicPage(),
  flipClass: x
};
typeof window < "u" && (window.ArabicMathJax = U, F());
export {
  S as configureMathJax,
  U as default,
  k as getMathJaxConfig,
  T as injectStyles,
  F as installAutoSetup,
  C as loadMathJax,
  A as preprocess,
  K as renderPage,
  P as typesetArabic
};
