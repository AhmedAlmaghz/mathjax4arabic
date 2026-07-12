import { useState, useEffect } from "react";
import MathPreview from "./MathPreview";
import CodeBlock from "./CodeBlock";
import FontSelector from "./FontSelector";
import { DEFAULT_TEX, PLAYGROUND_EXAMPLES } from "../lib/examples";
import { DEFAULT_FONT, MATH_FONTS, loadFont, applyMathFont, type MathFont } from "../lib/fonts";
import { cn } from "../utils/cn";

export default function Playground() {
  const [tex, setTex] = useState(DEFAULT_TEX);
  const [forceArabic, setForceArabic] = useState(true);
  const [display, setDisplay] = useState(true);
  const [font, setFont] = useState<MathFont>(DEFAULT_FONT);

  // Load all fonts on mount, apply selected
  useEffect(() => {
    MATH_FONTS.forEach(loadFont);
    applyMathFont(font);
  }, [font]);

  const currentExample = PLAYGROUND_EXAMPLES.find(ex => ex.tex === tex);

  return (
    <section id="playground" className="border-b border-slate-800/60 bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-black text-white">جرّب المكتبة مباشرة</h2>
          <p className="mt-3 text-slate-400">
            اكتب أي معادلة بصياغة TeX — تُترجم{" "}
            <span className="text-emerald-400 font-bold">تلقائياً</span>.
            اختر الخط الذي يعجبك!
          </p>
        </div>

        {/* ═══ اختيار الخط ═══ */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <label className="text-sm font-bold text-slate-300 mb-3 block flex items-center gap-2">
            <span className="text-lg">🖋️</span>
            خط الرموز الرياضية العربية:
          </label>
          <FontSelector selectedFont={font} onFontChange={setFont} />
        </div>

        {/* ═══ الأمثلة ═══ */}
        <div className="mb-6">
          <p className="text-xs text-slate-500 mb-2">أمثلة جاهزة:</p>
          <div className="flex flex-wrap gap-2">
            {PLAYGROUND_EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setTex(ex.tex)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  tex === ex.tex
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-400",
                )}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {currentExample?.description && (
          <div className="mb-4 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-400">
            💡 {currentExample.description}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              صياغة TeX
            </label>
            <textarea
              dir="ltr"
              value={tex}
              onChange={(e) => setTex(e.target.value)}
              rows={5}
              spellCheck={false}
              placeholder="اكتب معادلة TeX هنا..."
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-sm text-emerald-200 outline-none ring-emerald-500/40 focus:ring-2 placeholder:text-slate-600"
            />

            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <label className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceArabic}
                  onChange={(e) => setForceArabic(e.target.checked)}
                  className="h-4 w-4 accent-emerald-500"
                />
                <span>صفحة عربية</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={display}
                  onChange={(e) => setDisplay(e.target.checked)}
                  className="h-4 w-4 accent-emerald-500"
                />
                عرض كبير (display)
              </label>
            </div>

            <CodeBlock lang="TeX" code={tex} />
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              المعاينة — خط: {font.nameAr}
            </label>
            <MathPreview
              tex={tex}
              forceArabic={forceArabic}
              display={display}
              font={font}
              className="min-h-[220px] flex-1"
            />

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-500">
              <p className="mb-2 font-bold text-slate-400">ما يُقلب وما لا يُقلب:</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-emerald-400 font-bold mb-1">✅ يُقلب (تلقائياً):</p>
                  <p>∫ √ Σ ∈ ⊂ ∪ ∩ ← → الأقواس</p>
                </div>
                <div>
                  <p className="text-amber-400 font-bold mb-1">❌ لا يُقلب:</p>
                  <p>نصوص (صفر، نق) أرقام (٠-٩) دوال (جا، لغ) متغيرات (س، ص)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
