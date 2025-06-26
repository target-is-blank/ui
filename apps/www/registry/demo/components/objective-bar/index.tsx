import ObjectiveBar from "@/registry/components/objective-bar";
import { CheckIcon, LucideIcon, TruckIcon } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

const STEPS = 6;

export const ObjectiveBarDemo = () => {
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [isFinished, setIsFinished] = React.useState<boolean>(false);
  const [icon, setIcon] = React.useState<LucideIcon | undefined>(undefined);

  React.useEffect(() => {
    switch (currentStep) {
      case 0:
        setIcon(CheckIcon);
        break;
      case 3:
      case 5:
        setIcon(TruckIcon);
        break;
      default:
        setIcon(undefined);
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (STEPS - prev === 1 ? 0 : prev + 1));
      if (STEPS - currentStep === 1) {
        setIsFinished(true);
      } else {
        setIsFinished(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <ObjectiveBar steps={STEPS} currentStep={currentStep} icon={icon}>
      <div className="flex flex-col gap-2 text-center mt-2">
        {isFinished ? (
          <motion.span
            key="finished"
            className="text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            All done! 🎉
          </motion.span>
        ) : (
          <motion.span
            key="not-finished"
            className="text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {`Only ${STEPS - currentStep} ${
              STEPS - currentStep === 1 ? "step" : "steps"
            } left`}
          </motion.span>
        )}
      </div>
    </ObjectiveBar>
  );
};
