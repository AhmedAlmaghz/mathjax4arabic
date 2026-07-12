import { MATH_FONTS, type MathFont } from "../lib/fonts";
import { cn } from "../utils/cn";

interface FontSelectorProps {
  selectedFont: MathFont;
  onFontChange: (font: MathFont) => void;
}

export default function FontSelector({ selectedFont, onFontChange }: FontSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {MATH_FONTS.map((font) => (
        <button
          key={font.id}
          onClick={() => onFontChange(font)}
          className={cn(
            "rounded-lg border px-3 py-2 text-sm transition-all",
            selectedFont.id === font.id
              ? "border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-sm shadow-emerald-500/20"
              : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200",
          )}
        >
          <span className="block text-xs font-bold">{font.nameAr}</span>
          <span className="block text-[10px] opacity-60" dir="ltr">{font.name}</span>
        </button>
      ))}
    </div>
  );
}
