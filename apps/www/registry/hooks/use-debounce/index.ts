import * as React from "react";

function useDebounce<T>(
  callback: (...args: T[]) => void,
  delay = 300,
): (...args: T[]) => void {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = React.useCallback(
    (...args: T[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return debouncedCallback;
}

export default useDebounce;
