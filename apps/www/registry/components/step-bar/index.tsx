import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

interface StepBarProps {
  steps: number;
  currentStep: number;
  size?: "sm" | "md" | "lg";
  stepClassName?: string;
  containerClassName?: string;
  color?: string;
  lastStepVisible?: boolean;
  finished?: boolean;
  tooltipClassName?: string;
}

const StepBar = ({
  steps,
  currentStep,
  size = "md",
  stepClassName,
  containerClassName,
  color = "#ffe400",
  lastStepVisible = true,
  finished = false,
  tooltipClassName,
}: StepBarProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);

  const getStepColor = React.useCallback(
    (currentStep: number, index: number, color: string) => {
      if (finished) return { opacity: 1, color };

      if (currentStep < index + 1) {
        return {
          opacity: 0.2,
          color: lastStepVisible ? color : "transparent",
        };
      }
      if (currentStep === index + 1) {
        return { opacity: 0.5, color };
      }
      return { opacity: 1, color };
    },
    [finished, lastStepVisible],
  );

  const handleMouseEnter = React.useCallback(
    (index: number, currentStep: number) => {
      if (finished && steps - 1 === index) {
        setIsTooltipVisible(true);
        return;
      }

      if (index + 1 === currentStep && !finished) {
        setIsTooltipVisible(true);
      }
    },
    [finished, steps],
  );

  const handleMouseLeave = React.useCallback(() => {
    setIsTooltipVisible(false);
  }, []);

  const displayTooltipText = React.useCallback(
    (index: number) => {
      if (index === 0) {
        return "Début";
      }
      if (index === steps - 1 || finished) {
        return "Fin";
      }
      return `Étape ${index + 1}`;
    },
    [finished, steps],
  );

  if (currentStep > steps) {
    throw new Error("Current step cannot be greater than steps");
  }

  return (
    <div className={cn("flex items-center gap-1", containerClassName)}>
      {Array.from({ length: steps }).map((_, index) => {
        const { opacity, color: stepColor } = getStepColor(
          currentStep,
          index,
          color,
        );

        return (
          <div
            key={index}
            className={cn(
              "relative w-10 h-5",
              size === "sm" && "w-6 h-3",
              size === "md" && "w-10 h-5",
              size === "lg" && "w-14 h-7",
              stepClassName,
            )}
          >
            <div
              className={cn(
                "w-full h-full",
                index === 0 && "rounded-l-full",
                index === steps - 1 && "rounded-r-full",
              )}
              style={{
                background: stepColor,
                opacity: opacity,
                height: "100%",
                width: "100%",
              }}
              onMouseEnter={() => handleMouseEnter(index, currentStep)}
              onMouseLeave={handleMouseLeave}
            />
            {((finished && index === steps - 1 && isTooltipVisible) ||
              (!finished && currentStep === index + 1 && isTooltipVisible)) && (
              <AnimatePresence mode="wait">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={cn(
                    "absolute -top-[100%] -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 px-2 py-1 rounded-sm bg-black text-white text-xs whitespace-nowrap shadow-lg pointer-events-none",
                    tooltipClassName,
                  )}
                >
                  {displayTooltipText(index)}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepBar;
