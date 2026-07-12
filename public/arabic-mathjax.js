/*!
 * Arabic MathJax v4  —  https://github.com/OmarIthawi/arabic-mathjax (rewrite)
 * -------------------------------------------------------------------------
 * A modern, dependency-free re-implementation of the "arabic-mathjax"
 * MathJax v2 extension, redesigned from scratch to work with MathJax v4
 * (tested against 4.1.3) using only MathJax's official, documented TeX
 * macros (`\class{}{}` from the `html` package) instead of monkey-patching
 * internal renderer classes — which is what made the original extension
 * fragile and impossible to upgrade past MathJax v2.
 *
 * MIT License. Copyright (c) 2015-2016 Edraak.org, Omar Al-Ithawi and
 * contributors (original v2 extension). Copyright (c) 2024- contributors
 * to this v4 rewrite.
 *
 * See README.md at the project root for full documentation.
 */
(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ArabicMathJax = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var VERSION = "4.0.0";
  var FLIP_CLASS = "mjx-ar-flip";

  /* ------------------------------------------------------------------ *
   * 1. Configuration                                                    *
   * ------------------------------------------------------------------ */

  function defaultIsArabicPage() {
    try {
      var lang = (document.documentElement.getAttribute("lang") || "").toLowerCase();
      return lang.indexOf("ar") === 0;
    } catch (e) {
      return false;
    }
  }

  var config = {
    flipClass: FLIP_CLASS,

    // How the library decides whether the current page/context is Arabic.
    // Override with `ArabicMathJax.config.isArabicPage = function () {...}`.
    isArabicPage: defaultIsArabicPage,

    // Western -> Arabic-Indic digits.
    digits: {
      "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤",
      "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩"
    },
    decimalMark: "\u066B", // ٫  ARABIC DECIMAL SEPARATOR
    thousandsMark: "\u066C", // ٬  ARABIC THOUSANDS SEPARATOR

    // Single-letter identifiers, e.g. `x` -> `س`.
    identifiers: {
      a: "أ", b: "ب", c: "جـ", d: "د", e: "هـ",
      f: "ق", g: "جـ", h: "هـ", k: "ك", l: "ل",
      m: "م", n: "ن", r: "ر", t: "ت", x: "س",
      y: "ص", z: "ع"
    },

    // Function names, e.g. `\sin` -> `جا`.
    functions: {
      sin: "جا", cos: "تا", tan: "ظا", cot: "ظتا",
      sec: "قا", csc: "قتا", log: "لو", ln: "لون",
      lim: "نها"
    },

    // Punctuation used as separators inside numbers/lists.
    operators: {
      ",": "،",
      ";": "؛"
    },

    // Bilingual "leaf" vocabulary used by \zero, \radius, \Area, \charge.
    dictionary: {
      zero: { en: "0", ar: "صفر" },
      radius: { en: "r", ar: "نق" },
      Area: { en: "A", ar: "م" },
      charge: { en: "C", ar: "\u069B" } // ڛ
    }
  };

  /* ------------------------------------------------------------------ *
   * 2. Small utilities                                                  *
   * ------------------------------------------------------------------ */

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function deepAssign(target, source) {
    Object.keys(source || {}).forEach(function (key) {
      var value = source[key];
      if (value && typeof value === "object" && !Array.isArray(value) && typeof target[key] === "object") {
        deepAssign(target[key], value);
      } else {
        target[key] = value;
      }
    });
    return target;
  }

  /** Finds the index of the `}` that matches the `{` at `openIdx`. */
  function findMatchingBrace(str, openIdx) {
    var depth = 0;
    for (var i = openIdx; i < str.length; i++) {
      var c = str[i];
      if (c === "\\") { i++; continue; } // skip escaped char, e.g. \}
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  /** Reads one `{...}` TeX argument starting at (or before) position `pos`. */
  function readArg(str, pos) {
    while (pos < str.length && /\s/.test(str[pos])) pos++;
    if (str[pos] !== "{") {
      return { value: str[pos] || "", end: pos + 1 };
    }
    var close = findMatchingBrace(str, pos);
    if (close === -1) return { value: str.slice(pos + 1), end: str.length };
    return { value: str.slice(pos + 1, close), end: close + 1 };
  }

  /** Reads `n` consecutive `{...}` TeX arguments. */
  function readArgs(str, pos, n) {
    var args = [];
    for (var i = 0; i < n; i++) {
      var r = readArg(str, pos);
      args.push(r.value);
      pos = r.end;
    }
    return { args: args, end: pos };
  }

  function wrapFlip(inner) {
    return "\\class{" + config.flipClass + "}{" + inner + "}";
  }

  function text(s) {
    return "\\text{" + s + "}";
  }

  function mapDigits(numStr) {
    return String(numStr)
      .replace(/[0-9]/g, function (d) { return config.digits[d]; })
      .replace(/\./g, config.decimalMark)
      .replace(/,/g, config.thousandsMark);
  }

  var ARABIC_RANGE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g;

  /** Wraps every run of Arabic-script characters in a single flip+text node. */
  function wrapArabicRuns(str) {
    return str.replace(ARABIC_RANGE, function (m) { return wrapFlip(text(m)); });
  }

  /* ------------------------------------------------------------------ *
   * 3. The recursive TeX processor                                      *
   * ------------------------------------------------------------------ */

  /**
   * Walks a TeX string and expands Arabic-MathJax macros.
   * @param {string} input
   * @param {boolean} mirrored - true while we are nested inside an active
   *   `\ar`/`\alwaysar` scope (i.e. an outer `.mjx-ar-flip` is already applied).
   */
  function process(input, mirrored) {
    var out = "";
    var i = 0;
    var n = input.length;

    while (i < n) {
      var ch = input[i];

      if (ch === "\\") {
        var m = /^\\([a-zA-Z]+)/.exec(input.slice(i));
        if (m) {
          var name = m[1];
          var after = i + m[0].length;
          var handled = true;

          switch (name) {
            case "ar":
            case "alwaysar": {
              var rAr = readArg(input, after);
              var isAr = name === "alwaysar" ? true : config.isArabicPage();
              if (isAr) {
                var inner = process(rAr.value, true);
                inner = translateLeaves(inner);
                out += wrapFlip(inner);
              } else {
                out += process(rAr.value, mirrored);
              }
              i = rAr.end;
              break;
            }

            case "nomirror":
            case "fliph": // kept for familiarity with the v2 extension
            case "mirror": {
              var rM = readArg(input, after);
              out += wrapFlip(process(rM.value, mirrored));
              i = rM.end;
              break;
            }

            case "transx": {
              var rX = readArgs(input, after, 2);
              var chosenX = config.isArabicPage() ? rX.args[1] : rX.args[0];
              out += process(chosenX, mirrored);
              i = rX.end;
              break;
            }

            case "transt": {
              var rT = readArgs(input, after, 2);
              if (config.isArabicPage()) {
                var tNode = text(rT.args[1]);
                out += mirrored ? wrapFlip(tNode) : tNode;
              } else {
                out += process(rT.args[0], mirrored);
              }
              i = rT.end;
              break;
            }

            case "transs": {
              var rS = readArgs(input, after, 2);
              if (config.isArabicPage()) {
                out += wrapArabicRuns(rS.args[1]);
              } else {
                out += process(rS.args[0], mirrored);
              }
              i = rS.end;
              break;
            }

            case "transn": {
              var rN = readArg(input, after);
              if (config.isArabicPage()) {
                var numNode = text(mapDigits(rN.value));
                out += mirrored ? wrapFlip(numNode) : numNode;
              } else {
                out += rN.value;
              }
              i = rN.end;
              break;
            }

            case "tmfrac": {
              var rF = readArgs(input, after, 3);
              var whole = config.isArabicPage() ? mapDigits(rF.args[0]) : rF.args[0];
              var num = config.isArabicPage() ? mapDigits(rF.args[1]) : rF.args[1];
              var den = config.isArabicPage() ? mapDigits(rF.args[2]) : rF.args[2];
              var frac = whole + "\\tfrac{" + num + "}{" + den + "}";
              if (config.isArabicPage()) {
                out += mirrored ? wrapFlip(frac) : frac;
              } else {
                out += frac;
              }
              i = rF.end;
              break;
            }

            case "zero":
            case "radius":
            case "Area":
            case "charge": {
              var entry = config.dictionary[name];
              if (config.isArabicPage()) {
                var leaf = text(entry.ar);
                out += mirrored ? wrapFlip(leaf) : leaf;
              } else {
                out += entry.en;
              }
              i = after;
              break;
            }

            default:
              handled = false;
          }

          if (handled) continue;

          out += m[0];
          i = after;
          continue;
        }
      }

      if (ch === "{") {
        var close = findMatchingBrace(input, i);
        if (close === -1) { out += ch; i++; continue; }
        out += "{" + process(input.slice(i + 1, close), mirrored) + "}";
        i = close + 1;
        continue;
      }

      out += ch;
      i++;
    }

    return out;
  }

  /**
   * Applies the automatic, token-level translation that the original
   * extension performed on `mn` (numbers), `mi` (identifiers) and `mo`
   * (operators/function names) MathML nodes. Runs only inside an active
   * `\ar` / `\alwaysar` scope.
   */
  function translateLeaves(tex) {
    var fnNames = Object.keys(config.functions).sort(function (a, b) { return b.length - a.length; });
    if (fnNames.length) {
      var fnPattern = new RegExp("\\\\(" + fnNames.map(escapeRegExp).join("|") + ")(?![a-zA-Z])", "g");
      tex = tex.replace(fnPattern, function (_, fname) {
        return wrapFlip(text(config.functions[fname]));
      });
    }

    // Numbers (integers & decimals).
    tex = tex.replace(/\d+(?:\.\d+)?/g, function (numMatch) {
      return wrapFlip(text(mapDigits(numMatch)));
    });

    // List/decimal separators used stand-alone (","  ";").
    tex = tex.replace(/[,;]/g, function (sep) {
      return wrapFlip(text(config.operators[sep]));
    });

    // Bare single-letter identifiers (skips backslash command names).
    tex = replaceBareLetters(tex);

    return tex;
  }

  function replaceBareLetters(tex) {
    var out = "";
    var i = 0;
    while (i < tex.length) {
      var ch = tex[i];

      if (ch === "\\") {
        var m = /^\\([a-zA-Z]+)/.exec(tex.slice(i));
        if (m) {
          out += m[0];
          i += m[0].length;
          continue;
        }
        out += ch + (tex[i + 1] || "");
        i += 2;
        continue;
      }

      if (/[a-zA-Z]/.test(ch)) {
        var mapped = config.identifiers[ch.toLowerCase()];
        out += mapped ? wrapFlip(text(mapped)) : ch;
        i++;
        continue;
      }

      out += ch;
      i++;
    }
    return out;
  }

  /* ------------------------------------------------------------------ *
   * 4. Public API                                                       *
   * ------------------------------------------------------------------ */

  /**
   * Expands all Arabic-MathJax macros in a raw TeX string, returning a
   * plain TeX string that any standard MathJax v4 TeX input understands.
   * @param {string} tex
   * @param {{forceArabic?: boolean}} [opts]
   */
  function preprocess(tex, opts) {
    opts = opts || {};
    var previous = config.isArabicPage;
    if (typeof opts.forceArabic === "boolean") {
      var forced = opts.forceArabic;
      config.isArabicPage = function () { return forced; };
    }
    try {
      return process(String(tex == null ? "" : tex), false);
    } finally {
      config.isArabicPage = previous;
    }
  }

  var DELIMS = [
    { open: "$$", close: "$$", re: /\$\$([\s\S]+?)\$\$/g },
    { open: "\\[", close: "\\]", re: /\\\[([\s\S]+?)\\\]/g },
    { open: "$", close: "$", re: /\$([^$\n]+?)\$/g },
    { open: "\\(", close: "\\)", re: /\\\(([\s\S]+?)\\\)/g }
  ];

  function replaceDelimitedMath(html, opts) {
    DELIMS.forEach(function (d) {
      html = html.replace(d.re, function (whole, inner) {
        return d.open + preprocess(inner, opts) + d.close;
      });
    });
    return html;
  }

  /**
   * Scans element(s) for `$...$`, `$$...$$`, `\(...\)` and `\[...\]` math
   * regions, expands Arabic-MathJax macros inside them, then asks MathJax
   * to typeset the result. This is the easiest way to use the library:
   * write normal HTML + TeX, call `ArabicMathJax.renderPage()` once.
   *
   * @param {string|Element|Element[]|NodeList} [target=document.body]
   * @param {{forceArabic?: boolean, force?: boolean}} [opts]
   */
  function typesetArabic(target, opts) {
    opts = opts || {};
    var elements;
    if (!target) elements = [document.body];
    else if (typeof target === "string") elements = Array.prototype.slice.call(document.querySelectorAll(target));
    else if (target.length && target.nodeType === undefined) elements = Array.prototype.slice.call(target);
    else elements = [target];

    elements = elements.filter(Boolean);
    elements.forEach(function (el) {
      if (el.getAttribute("data-amj-processed") === "true" && !opts.force) return;
      el.innerHTML = replaceDelimitedMath(el.innerHTML, opts);
      el.setAttribute("data-amj-processed", "true");
    });

    if (root.MathJax && root.MathJax.typesetPromise) {
      return root.MathJax.typesetPromise(elements);
    }
    return Promise.resolve(elements);
  }

  function renderPage(opts) {
    return typesetArabic(document.body, opts);
  }

  var injectedStyleEl = null;
  function injectStyles() {
    if (injectedStyleEl || typeof document === "undefined") return;
    injectedStyleEl = document.createElement("style");
    injectedStyleEl.setAttribute("data-arabic-mathjax", "true");
    injectedStyleEl.textContent = ".mjx-ar-flip{display:inline-block;transform:scaleX(-1);-webkit-transform:scaleX(-1);}";
    document.head.appendChild(injectedStyleEl);
  }

  /**
   * Returns a ready-to-use MathJax v4 `window.MathJax` configuration
   * object pre-wired with everything Arabic MathJax needs (the `html`
   * package for `\class`, sane delimiters, etc). Deep-merges any
   * `overrides` you pass in.
   */
  function getMathJaxConfig(overrides) {
    var base = {
      loader: { load: ["[tex]/html"] },
      tex: {
        packages: { "[+]": ["html"] },
        inlineMath: [["$", "$"], ["\\(", "\\)"]],
        displayMath: [["$$", "$$"], ["\\[", "\\]"]]
      },
      chtml: { displayAlign: "center" },
      startup: { typeset: false }
    };
    return deepAssign(base, overrides || {});
  }

  return {
    version: VERSION,
    config: config,
    preprocess: preprocess,
    process: preprocess, // alias
    typesetArabic: typesetArabic,
    renderPage: renderPage,
    injectStyles: injectStyles,
    getMathJaxConfig: getMathJaxConfig,
    isArabicPage: function () { return config.isArabicPage(); },
    flipClass: FLIP_CLASS
  };
});
