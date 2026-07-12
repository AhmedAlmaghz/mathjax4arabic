const FEATURES = [
  {
    icon: "🔮",
    title: "كشف تلقائي",
    desc: "في الصفحات العربية، كل المعادلات تُكتشف وتُترجم تلقائياً بدون الحاجة لأي أمر خاص.",
  },
  {
    icon: "↔️",
    title: "قلب ذكي",
    desc: "فقط الرموز البنيوية (∫ √ Σ ∈ ⊂ الأسهم الأقواس) تُقلب. النصوص العربية والأرقام لا تُقلب.",
  },
  {
    icon: "🔢",
    title: "أرقام عربية",
    desc: "الأرقام 0-9 تتحول تلقائياً إلى ٠-٩ مع الفاصلة العشرية ٫ وفاصلة الألوف ٬.",
  },
  {
    icon: "📐",
    title: "لغ / لو / مجــ / حا",
    desc: "log → لغ (عشري)، ln → لو (طبيعي)، sum → مجــ (مجموع)، P → حا (احتمال) — وأكثر من ٣٠ دالة.",
  },
  {
    icon: "✍️",
    title: "خط الرقعة",
    desc: "النصوص العربية في المعادلات تُعرض بخط Aref Ruqaa الجميل — أقرب ما يكون لخط الرقعة اليدوي.",
  },
  {
    icon: "🔣",
    title: "أعداد مركبة",
    desc: "دعم كامل: \\imaginary → ت، \\Re → حق، \\Im → خي. صيغة أويلر بالعربية!",
  },
  {
    icon: "🧩",
    title: "توافق رسمي ١٠٠٪",
    desc: "تعتمد فقط على الأمر \\class{}{} الرسمي من MathJax — بلا تعديل على ملفات المحرّك الداخلية.",
  },
  {
    icon: "⚡",
    title: "بلا اعتماديات",
    desc: "وحدة TypeScript مدمجة في البناء. لا ملفات خارجية. حجم صغير جداً.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-b border-slate-800/60 bg-slate-900/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-black text-white">المميزات</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 transition hover:border-emerald-500/50"
            >
              <div className="mb-4 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-bold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
