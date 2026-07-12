import MathPreview from "./MathPreview";

const FEATURED = [
  { title: "صيغة أويلر", tex: "e^{i \\pi} + 1 = 0" },
  { title: "مجموع (مجــ)", tex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}" },
  { title: "احتمال (حا)", tex: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}" },
  { title: "لغ ≠ لو", tex: "\\log_{10}(x) \\neq \\ln(x)" },
  { title: "عدد مركب", tex: "e^{i \\theta} = \\cos(\\theta) + i \\sin(\\theta)" },
  { title: "تكامل", tex: "\\int_0^1 \\sqrt{x} \\, dx = \\frac{2}{3}" },
  { title: "نهاية", tex: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1" },
  { title: "مشتقة", tex: "\\frac{d}{dx} \\ln(x) = \\frac{1}{x}" },
  { title: "انتماء وجزئية", tex: "x \\in A \\subset B" },
];

const AUTO_TRANSLATIONS = [
  { from: "0-9", to: "٠-٩", type: "أرقام" },
  { from: "x, y, z, a, b…", to: "س، ص، ع، أ، ب…", type: "متغيرات" },
  { from: "log", to: "لغ", type: "لوغاريتم عشري" },
  { from: "ln", to: "لو", type: "لوغاريتم طبيعي" },
  { from: "sin, cos, tan", to: "جا، جتا، ظا", type: "مثلثية" },
  { from: "lim", to: "نهــا", type: "نهاية" },
  { from: "sum", to: "مجــ", type: "مجموع" },
  { from: "P", to: "حا", type: "احتمال" },
  { from: "prod", to: "جداء", type: "جداء" },
  { from: "max, min", to: "أقصى، أدنى", type: "أقصى/أدنى" },
  { from: "gcd", to: "ق.م.أ", type: "قاسم مشترك" },
];

export default function CommandsReference() {
  return (
    <section id="commands" className="border-b border-slate-800/60 bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-black text-white">الترجمات والأمثلة</h2>
          <p className="mt-3 text-slate-400">
            الرموز الخاصة (∫ √ Σ ∈ ⊂ الأسهم الأقواس) <span className="text-emerald-400">تُقلب تلقائياً</span>.
            كل ما له ترجمة عربية <span className="text-amber-400">لا يُقلب</span>.
          </p>
        </div>

        {/* ═══ أمثلة ═══ */}
        <div className="mb-10 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-6">
          <h3 className="text-lg font-bold text-emerald-400 mb-5">🌟 أمثلة حيّة</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-xs text-slate-500 mb-2 font-bold">{f.title}</p>
                <MathPreview tex={f.tex} forceArabic display={false} className="min-h-[52px]" />
                <code dir="ltr" className="block mt-2 text-[10px] font-mono text-slate-600 truncate">{f.tex}</code>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ جدول الترجمات ═══ */}
        <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="text-lg font-bold text-white mb-4">📐 جدول الترجمات التلقائية</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="text-start py-2 pe-4 font-medium">النوع</th>
                  <th className="text-start py-2 pe-4 font-medium" dir="ltr">English</th>
                  <th className="text-start py-2 font-medium">العربية</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {AUTO_TRANSLATIONS.map((t) => (
                  <tr key={t.type} className="border-b border-slate-800/60">
                    <td className="py-3 pe-4 text-emerald-400 whitespace-nowrap">{t.type}</td>
                    <td className="py-3 pe-4 font-mono text-slate-400" dir="ltr">{t.from}</td>
                    <td className="py-3 text-lg text-white">{t.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ ما يُقلب وما لا يُقلب ═══ */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-6 text-sm">
          <h3 className="text-base font-bold text-amber-400 mb-3">💡 المبدأ</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="font-bold text-emerald-400 mb-2">✅ يُقلب تلقائياً (رموز بدون ترجمة):</p>
              <p className="text-slate-400 leading-relaxed">
                رمز التكامل ∫، الجذر √، المجموع Σ، الجداء Π،
                الانتماء ∈، الجزئية ⊂، الاتحاد ∪، التقاطع ∩،
                الأسهم ← → ↔، الأقواس ( ) [ ] {"{ }"},
                علامات أكبر/أصغر {"< >"}, اللانهاية ∞
              </p>
            </div>
            <div>
              <p className="font-bold text-amber-400 mb-2">❌ لا يُقلب (كل ما له ترجمة):</p>
              <p className="text-slate-400 leading-relaxed">
                نصوص عربية (صفر، نق، م)،
                أرقام عربية (٠ ١ ٢ ٣)،
                أسماء الدوال (جا، جتا، لغ، لو، نهــا، مجــ، حا)،
                المتغيرات (س، ص، ع، أ، ب)،
                الحروف اليونانية (π θ α β)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
