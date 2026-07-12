import { useEffect } from "react";
import ArabicMathJax from "./lib/mathjax4arabic";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Playground from "./components/Playground";
import Features from "./components/Features";
import CommandsReference from "./components/CommandsReference";
import Installation from "./components/Installation";
import About from "./components/About";
import Footer from "./components/Footer";

export default function App() {
  useEffect(() => {
    // Inject the .mjx-ar-flip CSS rule as a fallback
    ArabicMathJax.injectStyles();
  }, []);

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-slate-950 font-sans antialiased">
      <Header />
      <main>
        <Hero />
        <Playground />
        <Features />
        <CommandsReference />
        <Installation />
        <About />
      </main>
      <Footer />
    </div>
  );
}
