import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";

export const DocsTrigger = <T extends string>({
  children,
  type,
  currentInstallationType,
  onClick,
}: {
  children: React.ReactNode;
  type: T;
  currentInstallationType: T;
  onClick: () => void;
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
        duration: 0.4,
      }}
      className={cn(
        "relative text-sm border-none rounded-lg px-4 py-2 h-full font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:text-foreground data-[state=active]:shadow-none",
        "text-neutral-500 dark:text-neutral-400",
        currentInstallationType === type &&
          "text-neutral-900 dark:text-neutral-100",
      )}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export const DocsRender = <T extends string>({
  children,
  type,
  currentInstallationType,
}: {
  children: React.ReactNode;
  type: T;
  currentInstallationType: T;
}) => {
  const isActive = currentInstallationType === type;
  return (
    <motion.div
      key={type}
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{
        opacity: isActive ? 1 : 0,
        filter: isActive ? "blur(0px)" : "blur(4px)",
        position: isActive ? "relative" : "absolute",
        pointerEvents: isActive ? "auto" : "none",
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
        duration: 0.4,
      }}
      className={cn("w-full", !isActive && "hidden")}
    >
      {children}
    </motion.div>
  );
};
