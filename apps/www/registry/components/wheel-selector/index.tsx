"use client";

import { cn } from "@workspace/ui/lib/utils";
import { animate, motion, useMotionValue } from "motion/react";
import * as React from "react";

function WheelSelector<T>({
  className,
  frameClassName,
  gap = 14,
  height = 30,
  items,
  numbersContainerClassName,
  value,
  width = 36,
  onChange,
  renderItem,
}: {
  className?: string;
  frameClassName?: string;
  gap?: number;
  height?: number;
  items: T[];
  numbersContainerClassName?: string;
  value?: T;
  width?: number;
  onChange?: (value: T) => void;
  renderItem?: ({
    item,
    isSelected,
  }: {
    item: T;
    isSelected: boolean;
  }) => React.ReactNode;
}) {
  const x = useMotionValue(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isGrabbing, setIsGrabbing] = React.useState(false);
  const [dragProps, setDragProps] = React.useState({});

  const itemWidth = width + gap;

  const selectedIndex = React.useMemo(() => {
    if (!value) return -1;
    return items.indexOf(value);
  }, [items, value]);

  React.useLayoutEffect(() => {
    if (containerRef.current && selectedIndex !== -1) {
      const containerCenter = containerRef.current.offsetWidth / 2;
      const targetX = containerCenter - selectedIndex * itemWidth - width / 2;

      animate(x, targetX, {
        type: "spring",
        damping: 30,
        stiffness: 400,
      });

      setDragProps({
        dragConstraints: {
          right: containerCenter - width / 2,
          left: containerCenter - (items.length - 1) * itemWidth - width / 2,
        },
        dragTransition: {
          power: 0.1,
          timeConstant: 250,
          modifyTarget: (target: number) => {
            const targetIndex = Math.round(
              (containerCenter - target - width / 2) / itemWidth,
            );
            const clampedIndex = Math.max(
              0,
              Math.min(targetIndex, items.length - 1),
            );
            const newValue = items[clampedIndex];
            onChange?.(newValue);

            const newTarget =
              containerCenter - clampedIndex * itemWidth - width / 2;
            return newTarget;
          },
        },
      });
    }
  }, [items, selectedIndex, itemWidth, x, onChange, width, gap]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-16 cursor-grab overflow-hidden",
        isGrabbing && "cursor-grabbing",
        className,
      )}
      style={{
        background: `linear-gradient(to right, rgba(255, 255, 255, 0.5) 40%, rgba(0, 0, 0, 0) 70%)`,
        mask: `linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%)`,
      }}
    >
      <motion.div
        drag="x"
        style={{
          x,
          gap,
        }}
        className={cn(
          "flex absolute top-1/2 items-center -translate-y-1/2",
          numbersContainerClassName,
        )}
        {...dragProps}
        onDragStart={() => setIsGrabbing(true)}
        onDragEnd={() => setIsGrabbing(false)}
      >
        {items.map((item, index) => {
          const isSelected = selectedIndex === index;

          return (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                width,
                height,
              }}
            >
              {renderItem ? (
                renderItem({ item, isSelected })
              ) : (
                <span
                  className="flex justify-center items-center w-full h-full text-black rounded-md transition-opacity"
                  style={{
                    opacity: isSelected ? 1 : 0.4,
                  }}
                >
                  {String(item)}
                </span>
              )}
            </div>
          );
        })}
      </motion.div>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={cn(
            "absolute top-1/2 left-1/2 rounded-md border-2 -translate-x-1/2 -translate-y-1/2 size-9 border-neutral-700",
            frameClassName,
          )}
          style={{
            width,
            height,
          }}
        />
      </div>
    </div>
  );
}

export default WheelSelector;
