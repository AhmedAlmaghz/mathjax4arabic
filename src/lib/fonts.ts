export interface MathFont {
  id: string;
  name: string;
  nameAr: string;
  family: string;
  googleFont: string; // Google Fonts family name for loading
}

export const MATH_FONTS: MathFont[] = [
  {
    id: "aref-ruqaa",
    name: "Aref Ruqaa",
    nameAr: "أريف رقعة",
    family: '"Aref Ruqaa", serif',
    googleFont: "Aref+Ruqaa:wght@400;700",
  },
  {
    id: "amiri",
    name: "Amiri",
    nameAr: "أميري",
    family: '"Amiri", serif',
    googleFont: "Amiri:ital,wght@0,400;0,700;1,400;1,700",
  },
  {
    id: "noto-naskh",
    name: "Noto Naskh Arabic",
    nameAr: "نوتو نسخ",
    family: '"Noto Naskh Arabic", serif',
    googleFont: "Noto+Naskh+Arabic:wght@400;500;600;700",
  },
  {
    id: "scheherazade",
    name: "Scheherazade New",
    nameAr: "شهرزاد",
    family: '"Scheherazade New", serif',
    googleFont: "Scheherazade+New:wght@400;700",
  },
  {
    id: "lateef",
    name: "Lateef",
    nameAr: "لطيف",
    family: '"Lateef", serif',
    googleFont: "Lateef:wght@400;700",
  },
  {
    id: "reem-kufi",
    name: "Reem Kufi",
    nameAr: "ريم كوفي",
    family: '"Reem Kufi", sans-serif',
    googleFont: "Reem+Kufi:wght@400;500;600;700",
  },
];

export const DEFAULT_FONT = MATH_FONTS[0]; // Aref Ruqaa

/** Load a Google Font dynamically */
export function loadFont(font: MathFont): void {
  const id = `arabic-mathjax-font-${font.id}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
  document.head.appendChild(link);
}

/** Apply a font to MathJax text elements */
export function applyMathFont(font: MathFont): void {
  loadFont(font);

  const id = "arabic-mathjax-font-style";
  let style = document.getElementById(id) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.appendChild(style);
  }

  style.textContent = `
mjx-mtext,
mjx-mtext > mjx-utext,
mjx-container mjx-mtext,
.MathJax mjx-mtext {
  font-family: ${font.family} !important;
  font-style: normal !important;
  font-weight: normal !important;
}`;
}
