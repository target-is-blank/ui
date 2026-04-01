import * as React from "react";

interface UseStaggeredRevealOptions {
  count: number;
  stagger?: number;
  initialDelay?: number;
  enabled?: boolean;
  triggerKey?: string | number;
}

interface UseStaggeredRevealReturn {
  getDelay: (index: number) => number;
  isVisible: (index: number) => boolean;
  replay: () => void;
}

function useStaggeredReveal({
  count,
  stagger = 60,
  initialDelay = 0,
  enabled = true,
  triggerKey,
}: UseStaggeredRevealOptions): UseStaggeredRevealReturn {
  const [visibleCount, setVisibleCount] = React.useState(0);
  const [iteration, setIteration] = React.useState(0);
  const timeoutsRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = React.useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const startReveal = React.useCallback(() => {
    clearAllTimeouts();
    setVisibleCount(0);

    if (!enabled || count === 0) return;

    for (let i = 0; i < count; i++) {
      const delay = initialDelay + i * stagger;
      const timeout = setTimeout(() => {
        setVisibleCount((prev) => Math.max(prev, i + 1));
      }, delay);
      timeoutsRef.current.push(timeout);
    }
  }, [count, stagger, initialDelay, enabled, clearAllTimeouts]);

  React.useEffect(() => {
    startReveal();
    return clearAllTimeouts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iteration, triggerKey]);

  React.useEffect(() => {
    startReveal();
    return clearAllTimeouts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replay = React.useCallback(() => {
    setIteration((prev) => prev + 1);
  }, []);

  const getDelay = React.useCallback(
    (index: number): number => initialDelay + index * stagger,
    [initialDelay, stagger],
  );

  const isVisible = React.useCallback(
    (index: number): boolean => enabled && index < visibleCount,
    [enabled, visibleCount],
  );

  return { getDelay, isVisible, replay };
}

export default useStaggeredReveal;
