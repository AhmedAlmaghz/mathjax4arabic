import MathPreview from "./MathPreview";

const BADGES = [
  "MathJax v4",
  "كشف تلقائي",
  "٦ خطوط عربية",
  "لغ / لو / مجــ / حا",
];

const HERO_EXAMPLES = [
  { label: "صيغة أويلر", tex: "e^{i \\pi} + 1 = 0" },
  { label: "المجموع (مجــ)", tex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}" },
  { label: "الاحتمال (حا)", tex: "P(A \\cap B) = P(A) \\cdot P(B|A)" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-slate-800/60 bg-slate-950">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(45,212,191,0.2), transparent 45%)",
      }} />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <div className="mb-6 flex flex-wrap gap-2">
            {BADGES.map((b) => (
              <span key={b} className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300">
                {b}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
            رياضيات عربية{" "}
            <span className="bg-gradient-to-l from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              بالخط الذي تريد
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            إعادة بناء <bdi dir="ltr">arabic-mathjax</bdi> لـ <bdi dir="ltr">MathJax v4</bdi>.
            كشف تلقائي. ٦ خطوط عربية للاختيار.
            الرموز الخاصة (∫ √ Σ ∈ ⊂) تُقلب تلقائياً.
            النصوص العربية لا تُقلب.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#playground" className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400">
              جرّبها الآن
            </a>
            <a href="#commands" className="rounded-xl border border-slate-700 px-6 py-3 font-bold text-slate-100 transition hover:border-emerald-500 hover:text-emerald-400">
              الترجمات
            </a>
          </div>
        </div>

        <div className="space-y-3">
          {HERO_EXAMPLES.map((ex) => (
            <div key={ex.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl backdrop-blur">
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-500 font-bold">{ex.label}</span>
                <code dir="ltr" className="mr-auto text-[10px] font-mono text-slate-600 truncate max-w-[180px]">{ex.tex}</code>
              </div>
              <MathPreview tex={ex.tex} forceArabic display={false} className="min-h-[48px]" />
            </div>
          ))}
          <p className="text-center text-xs text-slate-600">↑ كشف تلقائي — بدون أوامر</p>
        </div>
      </div>
    </section>
  );
}
