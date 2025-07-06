import StepBar from "@/registry/components/step-bar";
import { useTheme } from "next-themes";
import * as React from "react";

export const StepBarDemo = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isFinished, setIsFinished] = React.useState(false);
  const TOTAL_STEPS = 5;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = React.useCallback(() => {
    if (currentStep < TOTAL_STEPS + 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, TOTAL_STEPS]);

  const handleReset = React.useCallback(() => {
    setCurrentStep(1);
    setIsFinished(false);
  }, []);

  React.useEffect(() => {
    if (currentStep > TOTAL_STEPS) {
      setIsFinished(true);
    }
  }, [currentStep, TOTAL_STEPS]);

  React.useEffect(() => {
    setTimeout(
      () => {
        if (isFinished) {
          handleReset();
        } else {
          handleNext();
        }
      },
      isFinished ? 3000 : 1500,
    );
  }, [isFinished, handleNext, handleReset]);

  const customTooltip = React.useCallback(
    (index: number) => {
      const steps = [
        "Start your journey",
        "Choose your path",
        "Learn the basics",
        "Practice skills",
        "Master the craft",
        "You're done!",
      ];
      if (isFinished && index === TOTAL_STEPS - 1) {
        return steps[steps.length - 1];
      }
      return steps[index];
    },
    [isFinished],
  );

  const color = mounted ? (theme === "dark" ? "#FFF" : "#000") : "#000";

  return (
    <StepBar
      color={color}
      currentStep={currentStep}
      finished={isFinished}
      steps={TOTAL_STEPS}
      tooltipContent={customTooltip}
      tooltipKeepVisible
    />
  );
};
