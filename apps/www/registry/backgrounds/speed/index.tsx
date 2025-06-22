import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";
import * as React from "react";

interface SpeedBackgroundProps extends React.ComponentProps<"div"> {
  count?: number;
  color?: string;
  className?: string;
}

const SpeedBackground = ({
  count = 80,
  color = "black",
  className,
  ...props
}: SpeedBackgroundProps) => {
  const [lines, setLines] = React.useState<
    {
      angle: number;
      length: number;
      thickness: number;
      opacity: number;
    }[]
  >([]);

  React.useEffect(() => {
    setLines(
      Array.from({ length: count }).map(() => ({
        angle: Math.random() * 360,
        length: 500 + Math.random() * 500,
        thickness: 5 + Math.random() * 15,
        opacity: 0.1 + Math.random() * 0.5,
      })),
    );
  }, [count]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden w-full h-full",
        className,
      )}
      {...props}
    >
      <div className="absolute left-1/2 top-1/2">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              transform: `rotate(${line.angle}deg)`,
              width: `${line.length}px`,
              height: `${line.thickness}px`,
              opacity: line.opacity,
              backgroundColor: color,
              transformOrigin: "0% 50%",
              clipPath: "polygon(0% 50%, 100% 0%, 100% 100%)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SpeedBackground;
