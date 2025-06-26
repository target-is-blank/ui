import { cn } from "@workspace/ui/lib/utils";
import {
  motion,
  MotionValue,
  Transition,
  useAnimation,
  useMotionValue,
} from "motion/react";
import * as React from "react";

export enum OnHover {
  SLOW_DOWN = "slowDown",
  SPEED_UP = "speedUp",
  PAUSE = "pause",
  GO_BONKERS = "goBonkers",
}

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: OnHover;
  onClick?: () => void;
  className?: string;
}

const getRotationTransition = (
  duration: number,
  from: number,
  loop: boolean = true,
) => ({
  from,
  to: from + 360,
  ease: "linear" as const,
  duration,
  type: "tween" as const,
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: "spring" as const,
    damping: 20,
    stiffness: 300,
  },
});

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  onHover = OnHover.SPEED_UP,
  onClick,
  className,
}) => {
  const displayText = text.endsWith(" ") ? text : text + " ";
  const letters = Array.from(displayText);
  const controls = useAnimation();
  const rotation: MotionValue<number> = useMotionValue(0);

  React.useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  }, [spinDuration, text, onHover, controls, rotation]);

  const handleHoverStart = () => {
    const start = rotation.get();

    if (!onHover) return;

    let transitionConfig: ReturnType<typeof getTransition> | Transition;
    let scaleVal = 1;

    switch (onHover) {
      case OnHover.SLOW_DOWN:
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case OnHover.SPEED_UP:
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case OnHover.PAUSE:
        transitionConfig = {
          rotate: { type: "spring", damping: 20, stiffness: 300 },
          scale: { type: "spring", damping: 20, stiffness: 300 },
        };
        break;
      case OnHover.GO_BONKERS:
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig,
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      className={cn(
        "relative mx-auto rounded-full w-[200px] h-[200px] font-bold text-primary text-center cursor-pointer origin-center",
        className,
      )}
      style={{ rotate: rotation }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      onClick={handleClick}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const factor = Math.PI / letters.length;
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span
            key={i}
            className="absolute inline-block inset-0 top-0 left-0 bottom-0 right-0 text-2xl transition-all duration-500 ease-[cubic-bezier(0,0,0,1)]"
            style={{ transform, WebkitTransform: transform }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
