import { cn } from "@workspace/ui/lib/utils";
import { HTMLMotionProps, motion, Variants } from "motion/react";
import { useMemo } from "react";

type ClockCardProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  date?: string;
  hour?: string;
  format?: "12h" | "24h";
};

const cardVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 25 },
  },
  hover: {
    scale: 1.03,
    y: -4,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

const contentVariants: Variants = {
  rest: {
    opacity: 0,
    height: 0,
    y: 10,
    transition: { duration: 0.3, delay: 0.5 },
  },
  hover: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: { duration: 0.3, delay: 0.5 },
  },
};

export const ClockCard = ({
  children,
  className,
  date,
  hour,
  format = "24h",
  ...props
}: ClockCardProps) => {
  const resolvedDate = useMemo(() => {
    return (
      date ??
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, [date]);

  const resolvedHour = useMemo(() => {
    if (hour) return hour;
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }, [hour]);

  const { displayHour, meridiem } = useMemo(() => {
    const [hStr = "00", mStr = "00"] = resolvedHour.split(":");
    const hNum = parseInt(hStr, 10);

    if (format === "12h") {
      const isPM = hNum >= 12;
      const h12 = (((hNum + 11) % 12) + 1).toString().padStart(2, "0");
      return {
        displayHour: `${h12}:${mStr}`,
        meridiem: isPM ? "PM" : "AM",
      } as const;
    }

    return {
      displayHour: `${hStr.padStart(2, "0")}:${mStr}`,
      meridiem: null,
    } as const;
  }, [resolvedHour, format]);

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className={cn(
        "bg-neutral-100 border-2 border-white rounded-3xl shadow-md",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-center font-semibold text-primary-foreground bg-cover bg-bottom rounded-3xl h-[150px]",
        )}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1574610758891-5b809b6e6e2e?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        <div className="flex items-center justify-center gap-1">
          <span className="text-[50px] font-bold leading-none text-transparent bg-gradient-to-b from-white/90 via-white/50 to-white/20 bg-clip-text">
            {displayHour}
          </span>

          {meridiem && (
            <div className="flex flex-col items-center text-center gap-1">
              <span className="text-sm leading-none h-3 flex items-center justify-center text-transparent bg-gradient-to-b from-white/90 via-white/50 to-white/20 bg-clip-text">
                {meridiem.charAt(0)}
              </span>
              <span className="text-sm leading-none h-3 flex items-center justify-center text-transparent bg-gradient-to-b from-white/90 via-white/50 to-white/20 bg-clip-text">
                {meridiem.charAt(1)}
              </span>
            </div>
          )}
        </div>

        <div className="w-full text-center">
          <span className="text-sm text-transparent bg-gradient-to-b from-white/90 via-white/50 to-white/20 bg-clip-text">
            {resolvedDate}
          </span>
        </div>
      </div>

      <motion.div
        variants={contentVariants}
        className="flex flex-col gap-2 px-4 overflow-hidden"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
