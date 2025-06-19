"use client";

import { cn } from "@workspace/ui/lib/utils";
import React, { ReactElement, useEffect, useRef, useState } from "react";

export interface TransferProps {
  animation?: boolean;
  color?: string[];
  containerClassName?: string;
  containerHeight?: number;
  containerWidth?: string;
  direction?: "right" | "left";
  delay?: number;
  duration?: {
    min: number;
    max: number;
  };
  firstChild: React.ReactNode;
  maxCurve?: number;
  opacity?: number;
  secondChild: React.ReactNode;
  size?: {
    min: number;
    max: number;
  };
  speed?: {
    min: number;
    max: number;
  };
}

interface Particle {
  id: number;
  element: ReactElement;
  timeoutId: ReturnType<typeof setTimeout>;
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function getWidthPx(width: string, parentPx = 600): number {
  if (width.endsWith("px")) return parseFloat(width);
  if (width.endsWith("%")) return (parseFloat(width) / 100) * parentPx;

  return parseFloat(width) || parentPx;
}

function Transfer({
  animation = true,
  color = ["#000"],
  containerClassName,
  containerHeight = 40,
  containerWidth = "100%",
  delay = 40,
  direction = "right",
  duration = { min: 1.2, max: 1.8 },
  firstChild,
  maxCurve = 18,
  opacity = 1,
  secondChild,
  size = { min: 6, max: 12 },
  speed = { min: 0, max: 1.2 },
}: TransferProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(
    getWidthPx(containerWidth),
  );

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setMeasuredWidth(containerRef.current.getBoundingClientRect().width);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [containerWidth]);

  useEffect(() => {
    if (animation) {
      intervalRef.current = setInterval(() => {
        const randomSize = randomBetween(size.min, size.max);
        const generatedMaxCurve = Math.min(
          maxCurve,
          (containerHeight - randomSize) / 2,
        );
        const randomCurve = randomBetween(
          -generatedMaxCurve,
          generatedMaxCurve,
        );
        const minTop = Math.max(0, -randomCurve) + 1;
        const maxTop =
          Math.min(
            containerHeight - randomSize,
            containerHeight - randomSize - randomCurve,
          ) - 1;
        const startY = randomBetween(minTop, maxTop);
        const randomDelay = randomBetween(speed.min, speed.max);
        const randomDuration = randomBetween(duration.min, duration.max);
        const randomColor = Math.floor(randomBetween(0, color.length));
        const id = particleId.current++;

        const style: Record<string, unknown> = {
          backgroundColor: color[randomColor],
          opacity,
          width: `${randomSize}px`,
          height: `${randomSize}px`,
          animation: `particle-transfer-${direction} ${randomDuration}s cubic-bezier(.7,.2,.3,1) ${randomDelay}s 1`,
          ["--curve"]: `${randomCurve}px`,
        };
        if (direction === "right") {
          style.left = 0;
          style.top = `${startY}px`;
        } else if (direction === "left") {
          style.left = `calc(100% - ${randomSize}px)`;
          style.top = `${startY}px`;
        }

        const timeoutId = setTimeout(
          () => {
            setParticles((prev) => prev.filter((p) => p.id !== id));
          },
          (randomDelay + randomDuration) * 1000,
        );

        const element = (
          <div
            key={id}
            className="absolute rounded-full opacity-70"
            style={style}
          />
        );
        setParticles((prev) => [...prev, { id, element, timeoutId }]);
      }, delay);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    containerHeight,
    speed.max,
    speed.min,
    duration.max,
    duration.min,
    animation,
    maxCurve,
    size.max,
    size.min,
    color,
    opacity,
    direction,
    delay,
    measuredWidth,
  ]);

  useEffect(() => {
    return () => {
      setParticles((prev) => {
        prev.forEach((p) => clearTimeout(p.timeoutId));
        return [];
      });
    };
  }, []);

  const getKeyframes = () => {
    switch (direction) {
      case "right":
        return `
          @keyframes particle-transfer-right {
            0% { transform: translateX(0) translateY(0); opacity: 0; }
            10% { opacity: 1; }
            50% { transform: translateX(${measuredWidth / 2}px) translateY(var(--curve, 0px)); opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(${measuredWidth}px) translateY(0); opacity: 0; }
          }
        `;
      case "left":
        return `
          @keyframes particle-transfer-left {
            0% { transform: translateX(0) translateY(0); opacity: 0; }
            10% { opacity: 1; }
            50% { transform: translateX(-${measuredWidth / 2}px) translateY(var(--curve, 0px)); opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(-${measuredWidth}px) translateY(0); opacity: 0; }
          }
        `;
      default:
        return "";
    }
  };

  return (
    <>
      <style>{getKeyframes()}</style>
      <div
        className={cn(
          "flex items-center justify-between relative z-10",
          containerClassName,
        )}
        style={{ width: containerWidth }}
        ref={containerRef}
      >
        {firstChild}

        <div
          className="absolute left-0 top-0 w-full h-10 rounded-md overflow-hidden pointer-events-none"
          style={{ width: containerWidth }}
        >
          {particles.map((p) => p.element)}
        </div>

        {secondChild}
      </div>
    </>
  );
}

export default Transfer;
