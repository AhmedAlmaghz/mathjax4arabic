export interface TexExample {
  id: string;
  label: string;
  tex: string;
  description?: string;
}

export const PLAYGROUND_EXAMPLES: TexExample[] = [
  // ─── أساسية ───
  {
    id: "simple",
    label: "معادلة بسيطة",
    tex: "x = 1",
    description: "تُترجم تلقائياً: س = ١"
  },
  {
    id: "quadratic",
    label: "معادلة تربيعية",
    tex: "a x^2 + b x + c = 0",
  },

  // ─── اللوغاريتمات (لغ / لو) ───
  {
    id: "log",
    label: "لوغاريتم عشري (لغ)",
    tex: "\\log_{10}(x) = 2",
    description: "log → لغ (اللوغاريتم العشري)"
  },
  {
    id: "ln",
    label: "لوغاريتم طبيعي (لو)",
    tex: "\\ln(e^x) = x",
    description: "ln → لو (اللوغاريتم الطبيعي)"
  },
  {
    id: "log-vs-ln",
    label: "لغ ≠ لو",
    tex: "\\log(x) \\neq \\ln(x)",
    description: "لغ (عشري) ≠ لو (طبيعي)"
  },

  // ─── المجموع (مجــ) ───
  {
    id: "sum",
    label: "المجموع (مجــ)",
    tex: "\\sum_{n=1}^{10} n = 55",
    description: "sum → مجــ"
  },
  {
    id: "sum-infinite",
    label: "متسلسلة لانهائية",
    tex: "\\sum_{n=0}^{\\infty} r^n = \\frac{1}{1-r}",
  },

  // ─── الاحتمال (حا) ───
  {
    id: "prob",
    label: "الاحتمال (حا)",
    tex: "P(A \\cup B) = P(A) + P(B)",
    description: "P → حا"
  },
  {
    id: "prob-conditional",
    label: "احتمال شرطي",
    tex: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}",
    description: "قانون بايز"
  },

  // ─── الأعداد المركبة ───
  {
    id: "complex",
    label: "عدد مركب",
    tex: "z = a + b i",
    description: "ع = أ + ب ت"
  },
  {
    id: "euler",
    label: "صيغة أويلر",
    tex: "e^{i \\theta} = \\cos(\\theta) + i \\sin(\\theta)",
    description: "العلاقة بين الأسية والمثلثية"
  },
  {
    id: "euler-identity",
    label: "متطابقة أويلر",
    tex: "e^{i \\pi} + 1 = 0",
    description: "أجمل معادلة في الرياضيات"
  },
  {
    id: "complex-modulus",
    label: "معامل العدد المركب",
    tex: "|z| = \\sqrt{a^2 + b^2}",
  },

  // ─── التفاضل والتكامل ───
  {
    id: "integral",
    label: "تكامل",
    tex: "\\int_{0}^{\\pi} \\sin(x) \\, dx = 2",
  },
  {
    id: "limit",
    label: "نهاية",
    tex: "\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1",
  },
  {
    id: "derivative",
    label: "مشتقة",
    tex: "\\frac{d}{dx} \\ln(x) = \\frac{1}{x}",
    description: "مشتقة اللوغاريتم الطبيعي"
  },

  // ─── أوامر خاصة ───
  {
    id: "area",
    label: "مساحة الدائرة",
    tex: "\\Area = \\pi \\radius^2",
    description: "\\Area → م، \\radius → نق"
  },
  {
    id: "transt",
    label: "نص ثنائي اللغة",
    tex: "\\transt{\\text{where } x > 0}{حيث س > ٠}",
    description: "\\transt — النص العربي لا يُقلب"
  },
  {
    id: "overline",
    label: "المرافق",
    tex: "\\overline{z}=a-bi",
    description: "مرافق العدد المركب"
  },
  {
    id: "mathbb",
    label: "حرف كبير",
    tex: "\\mathbb{\\text{R}}",
    description: "رموز المجموعات الكبيرة"
  },
  {
    id: "bold",
    label: "نص عريض",
    tex: "\\textbf{\\text{A}}",
    description: "نص عريض"
  },


];

export const DEFAULT_TEX = "a x^2 + b x + c = 0";
