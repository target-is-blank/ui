import { cn } from "@workspace/ui/lib/utils";
import { HTMLMotionProps, motion } from "motion/react";
import * as React from "react";

interface CounterTimerProps extends HTMLMotionProps<"button"> {
  acceleration?: boolean;
  accentColor?: string;
  angleSpread?: number;
  disabled?: boolean;
  durationSeconds: number;
  label?: string;
  needleAngle?: number;
  maxAngle?: number;
  minAngle?: number;
  onClick?: () => void;
  onComplete?: () => void;
  tickCount?: number;
}

const CounterButton = ({
  durationSeconds,
  label,
  accentColor = "#FFA726",
  onComplete,
  onClick,
  needleAngle: needleAngleProp = 90,
  minAngle: minAngleProp = 0,
  maxAngle: maxAngleProp = 180,
  acceleration = false,
  angleSpread = 15,
  tickCount = 12,
  disabled = false,
  className,
  ...props
}: CounterTimerProps) => {
  const [remaining, setRemaining] = React.useState<number>(durationSeconds);
  const [needleAngle, setNeedleAngle] = React.useState<number>(needleAngleProp);
  const [targetAngle, setTargetAngle] = React.useState<number>(needleAngleProp);
  const [isDisabled, setIsDisabled] = React.useState<boolean>(disabled);
  const [isFinished, setIsFinished] = React.useState<boolean>(false);

  const spread = React.useMemo(() => angleSpread ?? 15, [angleSpread]);
  const minAngle = React.useMemo(() => {
    if (minAngleProp !== 0) return minAngleProp;
    const randomOffset = Math.random() * (2 * spread) - spread;
    return Math.max(0, needleAngleProp - spread + randomOffset);
  }, [minAngleProp, needleAngleProp, spread]);
  const maxAngle = React.useMemo(() => {
    if (maxAngleProp !== 180) return maxAngleProp;
    const randomOffset = Math.random() * (2 * spread) - spread;
    return Math.min(180, needleAngleProp + spread + randomOffset);
  }, [maxAngleProp, needleAngleProp, spread]);

  const ticks = React.useMemo(
    () =>
      Array.from({ length: tickCount }).map((_, i) => {
        const a = (i / (tickCount - 1)) * Math.PI;
        const x1 = (60 + Math.cos(a) * 40).toFixed(3);
        const y1 = (60 + Math.sin(a) * 40).toFixed(3);
        const x2 = (60 + Math.cos(a) * 56).toFixed(3);
        const y2 = (60 + Math.sin(a) * 56).toFixed(3);
        return { x1, y1, x2, y2, i };
      }),
    [tickCount],
  );

  const minutes = React.useMemo(() => Math.floor(remaining / 60), [remaining]);
  const seconds = React.useMemo(() => remaining % 60, [remaining]);

  const computedAngle = React.useMemo(
    () =>
      acceleration ? needleAngle : 180 - (remaining / durationSeconds) * 180,
    [needleAngle, remaining, durationSeconds, acceleration],
  );

  React.useEffect(() => {
    if (remaining <= 0) {
      setIsDisabled(true);
      setRemaining(0);
      setIsFinished(true);
      if (onComplete) onComplete();
      return;
    }
    setIsFinished(false);
    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining, onComplete]);

  React.useEffect(() => {
    if (!isFinished) return;
    let frame: number;
    const animateTo45 = () => {
      setNeedleAngle((prev) => {
        const target = 45;
        const diff = target - prev;
        if (Math.abs(diff) < 0.5) return target;
        return prev + diff * 0.15;
      });
      frame = requestAnimationFrame(animateTo45);
    };
    frame = requestAnimationFrame(animateTo45);
    return () => cancelAnimationFrame(frame);
  }, [isFinished]);

  React.useEffect(() => {
    if (!acceleration || isDisabled || isFinished) return;
    const interval = setInterval(() => {
      const range = maxAngle - minAngle;
      const randomProgress = Math.random();
      const newTarget = minAngle + range * randomProgress;
      setTargetAngle(newTarget);
    }, 500);
    return () => clearInterval(interval);
  }, [acceleration, minAngle, maxAngle, isDisabled, isFinished]);

  React.useEffect(() => {
    if (!acceleration || isFinished) return;
    let frame: number;
    const animate = () => {
      setNeedleAngle((prev) => {
        const diff = targetAngle - prev;
        if (Math.abs(diff) < 0.5) return targetAngle;
        return prev + diff * 0.15;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [acceleration, isDisabled, targetAngle, isFinished]);

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden flex items-center justify-center shadow-sm bg-primary text-secondary disabled:opacity-80 disabled:!text-muted-foreground border border-gray-800 rounded-lg py-2 pl-4 pr-[90px] transition-all duration-300",
        className,
      )}
      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
      disabled={isDisabled}
      {...props}
    >
      <div className="flex-1 flex flex-col items-start justify-center">
        <motion.div
          className="flex items-baseline gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-baseline gap-1">
            <span className="text-xl md:text-2xl font-bold tabular-nums">
              {minutes}
            </span>
            <span className="text-md md:text-lg text-gray-500">M</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl md:text-2xl font-bold tabular-nums">
              {seconds.toString().padStart(2, "0")}
            </span>
            <span className="text-md md:text-lg text-gray-500">S</span>
          </div>
        </motion.div>
        {label && (
          <motion.span
            className="text-gray-500 font-medium text-sm md:text-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {label}
          </motion.span>
        )}
      </div>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
      >
        <g transform="rotate(90 60 60)">
          {ticks.map(({ x1, y1, x2, y2, i }) => (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#888"
              strokeWidth="2"
              style={{
                animation: `tickFade ${2 + i * 0.1}s linear infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          <line
            x1="60"
            y1="60"
            x2={60 + Math.cos((computedAngle * Math.PI) / 180) * 52}
            y2={60 + Math.sin((computedAngle * Math.PI) / 180) * 52}
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0px 0px 4px #${accentColor}88)`,
              animation: "needlePulse 1s ease-in-out infinite",
            }}
          />
          <circle
            cx="60"
            cy="60"
            r="10"
            fill="#fff"
            stroke="#ccc"
            strokeWidth="2"
          />
        </g>
        <style>
          {`
            @keyframes tickFade {
              0% { opacity: 0.3; }
              50% { opacity: 1; }
              100% { opacity: 0.3; }
            }
            @keyframes needlePulse {
              0%, 100% { filter: drop-shadow(0px 0px 4px #${accentColor}88); }
              50% { filter: drop-shadow(0px 0px 8px #${accentColor}); }
            }
          `}
        </style>
      </svg>
    </motion.button>
  );
};

export default CounterButton;
