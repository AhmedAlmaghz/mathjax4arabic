import { useEffect, useState } from "react";

/**
 * Resolves once MathJax v4 has finished loading and is ready to typeset.
 * ArabicMathJax is now an ES module import, so it's always available.
 */
export function useMathJaxReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const checkReady = () => {
      const MJ = window.MathJax;
      if (MJ && typeof MJ.typesetPromise === "function") {
        if (!cancelled) {
          setReady(true);
        }
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkReady()) return;

    // Poll every 100ms
    intervalId = setInterval(checkReady, 100);

    // Timeout after 20 seconds to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        console.warn("[useMathJaxReady] Timed out waiting for MathJax");
        setReady(true);
        if (intervalId) clearInterval(intervalId);
      }
    }, 20000);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return ready;
}
