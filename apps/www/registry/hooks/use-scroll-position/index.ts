import * as React from "react";

type Position = {
  x: number;
  y: number;
};

interface UseScrollPositionOptions {
  throttleDelay?: number;
  element?: HTMLElement | null;
}

export function useScrollPosition({
  throttleDelay = 100,
  element,
}: UseScrollPositionOptions = {}) {
  const [position, setPosition] = React.useState<Position>({ x: 0, y: 0 });
  const prevPosition = React.useRef<Position>({ x: 0, y: 0 });
  const timeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const target = element ?? window;

    const getScroll = (): Position => {
      if (element) {
        return {
          x: element.scrollLeft,
          y: element.scrollTop,
        };
      } else {
        return {
          x: window.scrollX,
          y: window.scrollY,
        };
      }
    };

    const handleScroll = () => {
      if (timeout.current) return;

      timeout.current = setTimeout(() => {
        const currPos = getScroll();
        setPosition(currPos);
        prevPosition.current = currPos;
        timeout.current = null;
      }, throttleDelay);
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", handleScroll);
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [throttleDelay, element]);

  return {
    x: position.x,
    y: position.y,
    direction: {
      horizontal:
        position.x > prevPosition.current.x
          ? "right"
          : position.x < prevPosition.current.x
            ? "left"
            : null,
      vertical:
        position.y > prevPosition.current.y
          ? "down"
          : position.y < prevPosition.current.y
            ? "up"
            : null,
    },
  };
}
