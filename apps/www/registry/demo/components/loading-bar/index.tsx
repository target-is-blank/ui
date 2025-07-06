import LoadingBar from "@/registry/components/loading-bar";
import { useTheme } from "next-themes";
import * as React from "react";

export const LoadingBarDemo = () => {
  const { theme } = useTheme();
  const [progress, setProgress] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);
  const [elapsedTime, setElapsedTime] = React.useState(0);

  React.useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setProgress(0);
        setElapsedTime(0);
        setIsComplete(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setElapsedTime((t) => t + 1);
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          return 100;
        }
        const randomStep = Math.floor(Math.random() * 25) + 5;
        return Math.min(prev + randomStep, 100);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete]);

  const averageSpeed = elapsedTime > 0 ? progress / elapsedTime : 0;
  const timeLeft =
    averageSpeed > 0 ? Math.ceil((100 - progress) / averageSpeed) : 0;

  const indicator =
    progress < 100 && timeLeft > 0
      ? `About ${timeLeft} second${timeLeft > 1 ? "s" : ""} remaining...`
      : elapsedTime > 0
        ? "Finished"
        : "Loading...";

  return (
    <LoadingBar
      color={theme === "dark" ? "#FFF" : "#000"}
      progress={progress}
      indicator={indicator}
      completed={isComplete}
    />
  );
};
