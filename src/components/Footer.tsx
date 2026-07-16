export default function Footer() {
  return (
    <footer className="bg-slate-950 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center text-sm text-slate-500">
        <p>
          MathJax4Arabic v1.1.3 — رخصة MIT · مبني فوق{" "}
          <a href="https://www.mathjax.org" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
            MathJax v4.2.0
          </a>
        </p>
        <p dir="ltr" className="font-mono text-xs">
          Inspired by github.com/OmarIthawi/arabic-mathjax — MIT License
        </p>
        <p dir="ltr" className="font-bold text-xl">
          Powered by  <a href="https://github.com/AhmedAlmaghz/mathjax4arabic" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
            Ahmed Almaghz
          </a> © 2026
        </p>
      </div>
    </footer>
  );
}
