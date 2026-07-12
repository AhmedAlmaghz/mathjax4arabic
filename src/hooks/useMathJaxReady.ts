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

    const markReady = () => {
      if (!cancelled) setReady(true);
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const checkReady = () => {
      const MJ = window.MathJax;
      if (MJ && typeof MJ.typesetPromise === "function") {
        markReady();
        return true;
      }
      return false;
    };

    // Check immediately, then follow MathJax's startup promise if it is still loading.
    if (checkReady()) return;
    const startupPromise = window.MathJax?.startup?.promise;
    if (startupPromise && typeof startupPromise.then === "function") {
      startupPromise.then(markReady).catch(() => {
        if (!cancelled) console.warn("[useMathJaxReady] MathJax startup failed");
      });
    }

    // Poll every 100ms as a fallback while the CDN script is loading.
    intervalId = setInterval(checkReady, 100);

    // Timeout after 20 seconds to prevent infinite loading.
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        console.warn("[useMathJaxReady] Timed out waiting for MathJax");
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
