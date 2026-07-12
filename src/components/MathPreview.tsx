import { useEffect, useRef, useState } from "react";
import { useMathJaxReady } from "../hooks/useMathJaxReady";
import ArabicMathJax from "../lib/mathjax4arabic";
import { cn } from "../utils/cn";
import type { MathFont } from "../lib/fonts";

interface MathPreviewProps {
  tex: string;
  forceArabic: boolean;
  display?: boolean;
  className?: string;
  font?: MathFont;
}

export default function MathPreview({ tex, forceArabic, display = true, className, font }: MathPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useMathJaxReady();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !ref.current) return;
    const el = ref.current;
    const MJ = window.MathJax;
    if (!MJ || typeof MJ.typesetPromise !== "function") {
      setError("MathJax غير متاح");
      return;
    }

    let cancelled = false;

    const render = async () => {
      setError(null);
      try { MJ.typesetClear?.([el]); } catch { /* */ }

      try {
        const processed = ArabicMathJax.preprocess(tex, { forceArabic });
        const wrapped = display ? `\\[${processed}\\]` : `\\(${processed}\\)`;
        el.innerHTML = "";
        el.textContent = wrapped;
        await MJ.typesetPromise([el]);
      } catch (err) {
        if (!cancelled) {
          setError(`خطأ: ${err instanceof Error ? err.message : err}`);
          el.innerHTML = "";
        }
      }
    };

    render();
    return () => { cancelled = true; };
  }, [tex, forceArabic, display, ready, font]);

  // Apply font via inline style on container
  const fontStyle = font ? { fontFamily: font.family } : undefined;

  return (
    <div
      className={cn(
        "flex min-h-[96px] w-full items-center justify-center overflow-x-auto rounded-xl border bg-white p-6 transition-all",
        forceArabic ? "border-emerald-200" : "border-slate-200",
        className,
      )}
      dir={forceArabic ? "rtl" : "ltr"}
    >
      {!ready && (
        <span className="flex items-center gap-2 text-sm text-slate-400">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          جارٍ تحميل MathJax…
        </span>
      )}
      {error && <div className="font-mono text-sm text-rose-500" dir="ltr">{error}</div>}
      <div ref={ref} className={cn(!ready && "hidden")} style={fontStyle} />
    </div>
  );
}
