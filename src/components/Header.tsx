const NAV_LINKS = [
  { href: "#playground", label: "التجربة الحيّة" },
  { href: "#features", label: "المميزات" },
  { href: "#commands", label: "الأوامر" },
  { href: "#install", label: "التثبيت" },
  { href: "#about", label: "حول المشروع" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 font-mono text-lg font-black text-slate-950 shadow-lg shadow-emerald-500/20">
            ج
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-bold text-white">Arabic MathJax</span>
            <span className="text-xs text-slate-400">إصدار متوافق مع MathJax v4.1.3</span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-emerald-400"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="https://github.com/OmarIthawi/arabic-mathjax"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 transition hover:border-emerald-500 hover:text-emerald-400 sm:flex"
        >
          المشروع الأصلي ↗
        </a>
      </div>
    </header>
  );
}
