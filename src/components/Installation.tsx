import { useState } from "react";
import CodeBlock from "./CodeBlock";
import { cn } from "../utils/cn";

const CDN_SNIPPET = `<!-- 1) خط Amiri اختياري لعرض عربي أجمل -->
<link href="https://fonts.googleapis.com/css2?family=Amiri&display=swap" rel="stylesheet">

<!-- 2) ورقة أنماط Arabic MathJax -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/arabic-mathjax@4/dist/arabic-mathjax.css">

<!-- 3) مكتبة Arabic MathJax (يجب تحميلها قبل إعداد MathJax) -->
<script src="https://cdn.jsdelivr.net/npm/arabic-mathjax@4/dist/arabic-mathjax.js"></script>

<!-- 4) إعداد MathJax عبر الدالة المساعدة، ثم تحميل MathJax v4.1.3 -->
<script>
  window.MathJax = window.ArabicMathJax.getMathJaxConfig();
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@4.1.3/tex-chtml.js" id="MathJax-script" async></script>`;

const HTML_USAGE_SNIPPET = `<p lang="ar" dir="rtl">
  حلّ المعادلة: \\( \\ar{a x^2 + b x + c = 0} \\)
</p>

<script>
  // بعد جاهزية MathJax، امسح الصفحة بالكامل وترجم كل الصيغ الرياضية دفعة واحدة:
  window.MathJax.startup.promise.then(() => {
    window.ArabicMathJax.renderPage();
  });
</script>`;

const NPM_INSTALL = `npm install arabic-mathjax mathjax@4`;

const NPM_USAGE = `import ArabicMathJax from "arabic-mathjax";
import "arabic-mathjax/dist/arabic-mathjax.css";
import { mathjax } from "mathjax-full/js/mathjax.js";
import { TeX } from "mathjax-full/js/input/tex.js";
import { CHTML } from "mathjax-full/js/output/chtml.js";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor.js";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html.js";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const html = mathjax.document("", {
  InputJax: new TeX({ packages: ["base", "html"] }),
  OutputJax: new CHTML(),
});

// حوّل صياغتك أولًا عبر Arabic MathJax، ثم مرّرها إلى MathJax كالمعتاد:
const tex = ArabicMathJax.preprocess("\\\\ar{x = 1}", { forceArabic: true });
const node = html.convert(tex, { display: true });
console.log(adaptor.outerHTML(node));`;

const REACT_USAGE = `import { useEffect, useRef } from "react";

function ArabicFormula({ tex, forceArabic = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.MathJax || !window.ArabicMathJax) return;
    const processed = window.ArabicMathJax.preprocess(tex, { forceArabic });
    ref.current.textContent = \`\\\\[\${processed}\\\\]\`;
    window.MathJax.typesetPromise([ref.current]);
  }, [tex, forceArabic]);

  return <div ref={ref} />;
}`;

const TABS = [
  { id: "cdn", label: "عبر CDN (الأسرع)" },
  { id: "usage", label: "الاستخدام في الصفحة" },
  { id: "npm", label: "عبر npm / Node" },
  { id: "react", label: "React / Vite" },
] as const;

export default function Installation() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("cdn");

  return (
    <section id="install" className="border-b border-slate-800/60 bg-slate-900/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-black text-white">التثبيت والاستخدام</h2>
          <p className="mt-3 text-slate-400">
            لا حاجة لأي أدوات بناء (build tools) لتشغيل المكتبة — ملف واحد فقط. إن كنت تستخدم React أو أي
            حزمة حديثة، اتّبع تبويب «React / Vite».
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                tab === t.id
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-400",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "cdn" && <CodeBlock lang="html" code={CDN_SNIPPET} />}
        {tab === "usage" && <CodeBlock lang="html" code={HTML_USAGE_SNIPPET} />}
        {tab === "npm" && (
          <div className="flex flex-col gap-4">
            <CodeBlock lang="bash" code={NPM_INSTALL} />
            <CodeBlock lang="js" code={NPM_USAGE} />
          </div>
        )}
        {tab === "react" && <CodeBlock lang="jsx" code={REACT_USAGE} />}

        <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-200">
          💡 هذا المستودع التجريبي (الموقع الذي تتصفّحه الآن) يحمّل المكتبة محليًا من{" "}
          <code dir="ltr">/arabic-mathjax.js</code> و <code dir="ltr">/arabic-mathjax.css</code> — راجع ملف
          <code dir="ltr" className="mx-1">README.md</code> في جذر المشروع للحصول على الشرح الكامل بالعربية.
        </div>
      </div>
    </section>
  );
}
