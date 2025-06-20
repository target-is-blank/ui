import { cn } from "@workspace/ui/lib/utils";
import { CheckCircleIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface LoadingBarProps {
  color?: string;
  completed?: boolean;
  finishedComponentClassName?: string;
  finishedComponent?: React.ReactNode;
  indicator?: string;
  loadingClassName?: string;
  progress: number;
}

const LoadingBar = ({
  color = "#000",
  completed = false,
  finishedComponentClassName,
  finishedComponent,
  indicator,
  loadingClassName,
  progress,
}: LoadingBarProps) => {
  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        {!completed ? (
          <>
            <div
              key="bar"
              className="relative w-full h-2 bg-gray-200 rounded-full dark:bg-gray-800"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full rounded-full transition-all duration-300"
                style={{ background: color }}
              />
              <span
                className={cn(
                  "absolute top-0 right-0 z-10 text-xs font-medium text-black -translate-y-full",
                  loadingClassName,
                )}
              >
                {progress}%
              </span>
            </div>
            {indicator && (
              <span className="mt-1 text-xs text-gray-400">{indicator}</span>
            )}
          </>
        ) : (
          <motion.div
            key="icon"
            initial={{ opacity: 0, scale: 0.8, y: 10, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 360 }}
            exit={{ opacity: 0, scale: 0.8, y: -10, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 1,
            }}
            className={cn(
              "flex justify-center items-center",
              finishedComponentClassName,
            )}
          >
            {finishedComponent || <CheckCircleIcon className="size-6" />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingBar;
