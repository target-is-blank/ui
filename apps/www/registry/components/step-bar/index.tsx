import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

const DEFAULT_COMPONENT = "div";

interface StepBarProps<T extends React.ElementType = typeof DEFAULT_COMPONENT> {
  color?: string;
  containerClassName?: string;
  currentStep: number;
  finished?: boolean;
  lastStepVisible?: boolean;
  onCurrentStepHover?: (index: number) => void;
  onCurrentStepLeave?: () => void;
  onStepHover?: (index: number) => void;
  onStepLeave?: () => void;
  tooltipClassName?: string;
  tooltipContent?: (index: number) => string;
  tooltipKeepVisible?: boolean;
  size?: "sm" | "md" | "lg";
  steps: number;
  stepClassName?: string;
  stepComponent?: T;
}

const StepBar = <T extends React.ElementType = typeof DEFAULT_COMPONENT>({
  color = "#000",
  containerClassName,
  currentStep,
  finished = false,
  lastStepVisible = true,
  onCurrentStepHover,
  onCurrentStepLeave,
  onStepHover,
  onStepLeave,
  tooltipClassName,
  tooltipContent,
  tooltipKeepVisible = false,
  size = "md",
  steps,
  stepClassName,
  stepComponent,
  ...props
}: StepBarProps<T>) => {
  const Component = stepComponent || DEFAULT_COMPONENT;

  const [isTooltipVisible, setIsTooltipVisible] =
    React.useState(tooltipKeepVisible);
  const isFinished = React.useMemo(
    () => finished || currentStep > steps,
    [finished, currentStep, steps],
  );

  const getStepColor = React.useCallback(
    (currentStep: number, index: number, color: string) => {
      if (isFinished) return { opacity: 1, color };

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
    [isFinished, lastStepVisible],
  );

  const handleMouseEnter = React.useCallback(
    (index: number, currentStep: number) => {
      onStepHover?.(index);

      if (isFinished && steps - 1 === index) {
        setIsTooltipVisible(true);
        onCurrentStepHover?.(index);
        return;
      }

      if (index + 1 === currentStep && !isFinished) {
        setIsTooltipVisible(true);
        onCurrentStepHover?.(index);
      }
    },
    [isFinished, onCurrentStepHover, onStepHover, steps],
  );

  const handleMouseLeave = React.useCallback(
    (index: number) => {
      if (!tooltipKeepVisible) {
        setIsTooltipVisible(false);
        onStepLeave?.();
      }

      if (currentStep === index + 1 && !isFinished) {
        onCurrentStepLeave?.();
      }
    },
    [
      tooltipKeepVisible,
      currentStep,
      isFinished,
      onStepLeave,
      onCurrentStepLeave,
    ],
  );

  const displayTooltipText = React.useCallback(
    (index: number) => {
      if (tooltipContent) return tooltipContent(index);

      if (index === 0) {
        return "Start";
      }
      if (index > steps || isFinished) {
        return "End";
      }
      return `Step ${index + 1}`;
    },
    [isFinished, steps, tooltipContent],
  );

  return (
    <div
      className={cn(
        "flex items-center gap-1 transition-all duration-300",
        containerClassName,
      )}
    >
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
              "relative w-10 h-5 transition-all duration-300",
              size === "sm" && "w-6 h-3",
              size === "md" && "w-10 h-5",
              size === "lg" && "w-14 h-7",
              stepClassName,
            )}
          >
            <Component
              className={cn(
                "w-full h-full transition-all duration-300",
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
              onMouseLeave={() => handleMouseLeave(index)}
              {...props}
            />
            {((isFinished && index === steps - 1 && isTooltipVisible) ||
              (!isFinished &&
                currentStep === index + 1 &&
                isTooltipVisible)) && (
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
