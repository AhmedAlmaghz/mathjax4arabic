import { useState } from "react";
import { cn } from "../utils/cn";

interface CodeBlockProps {
  code: string;
  lang?: string;
  className?: string;
}

export default function CodeBlock({ code, lang = "html", className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div
      dir="ltr"
      className={cn(
        "group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-left shadow-inner",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">{lang}</span>
        <button
          onClick={onCopy}
          className="rounded-md border border-slate-700 px-2 py-1 font-mono text-[11px] text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
        >
          {copied ? "تم النسخ ✓" : "نسخ"}
        </button>
      </div>
      <pre className="max-w-full overflow-x-auto p-4 text-[13px] leading-relaxed text-slate-100">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
