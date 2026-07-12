import { useState } from "react";
import CodeBlock from "./CodeBlock";
import { cn } from "../utils/cn";

const CDN_SNIPPET = `<!-- رابط واحد فقط: يضبط MathJax، يحقن الأنماط، يحمّل MathJax، ثم يعرض الصفحة تلقائياً -->
<script type="module" src="https://cdn.jsdelivr.net/npm/mathjax4arabic@1/dist/browser.js"></script>`;

const HTML_USAGE_SNIPPET = `<p lang="ar" dir="rtl">
  حلّ المعادلة: \\( a x^2 + b x + c = 0 \\)
</p>`;

const NPM_INSTALL = `npm install mathjax4arabic`;

const NPM_USAGE = `import ArabicMathJax from "mathjax4arabic/browser";

// لا تحتاج لضبط MathJax أو استيراد CSS.
// المدخل browser يضبط كل شيء تلقائياً ويعرض الصفحة.
console.log(ArabicMathJax.version);`;

const REACT_USAGE = `import "mathjax4arabic/browser";

export default function ArabicFormula() {
  return <div lang="ar" dir="rtl">\\( x^2 + y^2 = r^2 \\)</div>;
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

        <div className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm leading-relaxed text-emerald-100">
          💡 الاستخدام الافتراضي أصبح بدون إعدادات: انسخ رابط CDN أو استورد مدخل المتصفح من npm، وستتولى الحزمة
          ضبط MathJax وحقن الأنماط وتحويل المعادلات تلقائياً.
        </div>
      </div>
    </section>
  );
}
