import { cn } from "@workspace/ui/lib/utils";
import { PackageIcon } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

interface ObjectiveBarProps {
  startLabel?: string;
  endLabel?: string;
  bgColor?: string;
  accentColor?: string;
  icon?: React.ElementType;
  steps?: number;
  currentStep?: number;
  children: React.ReactNode;
}

const ObjectiveBar = ({
  startLabel,
  endLabel,
  bgColor,
  accentColor,
  icon: Icon = PackageIcon,
  steps = 4,
  currentStep: currentStepProp = 2,
  children,
}: ObjectiveBarProps) => {
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const currentStepRef = React.useRef<HTMLDivElement>(null);
  const points = Array.from({ length: steps }, (_, i) => i);
  const primaryColor = React.useMemo(() => bgColor || "#000", [bgColor]);
  const secondaryColor = React.useMemo(
    () => accentColor || "#fff",
    [accentColor],
  );

  React.useEffect(() => {
    setTimeout(() => {
      setCurrentStep(currentStepProp);
    }, 1000);
  }, [currentStepProp]);

  return (
    <div className="flex flex-col gap-2 w-full rounded-lg p-2">
      <div
        className="relative w-full h-6 rounded-full border"
        style={{
          background: primaryColor,
        }}
      >
        {startLabel && (
          <span
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted text-xs z-20"
            style={{
              color: currentStep === 0 ? secondaryColor : primaryColor,
            }}
          >
            {startLabel}
          </span>
        )}
        <motion.div
          className="absolute h-full rounded-l-full"
          style={{
            background: secondaryColor,
          }}
          animate={{ width: `calc(${(currentStep / (steps - 1)) * 100}%)` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        <motion.div
          ref={currentStepRef}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 shadow-sm flex items-center justify-center rounded-full bg-primary-foreground p-2 z-30 border",
            currentStep !== 0 && "-translate-x-1/2",
          )}
          animate={{
            left: `calc(${(currentStep / (steps - 1)) * 100}% - 2px)`,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          <Icon className="size-6" />
        </motion.div>
        {endLabel && (
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted text-xs z-20"
            style={{
              color: currentStep !== steps ? secondaryColor : primaryColor,
            }}
          >
            {endLabel}
          </span>
        )}
        {points.length > 2 &&
          points.slice(1, -1).map((point, index) => (
            <span
              key={point}
              className="absolute top-1/2 -translate-y-1/2 z-10 rounded-full size-1 transition-all duration-300"
              style={{
                left: `calc(${(point / (steps - 1)) * 100}% - 2px)`,
                background: index < currentStep ? primaryColor : secondaryColor,
              }}
            />
          ))}
      </div>
      {children}
    </div>
  );
};

export default ObjectiveBar;
