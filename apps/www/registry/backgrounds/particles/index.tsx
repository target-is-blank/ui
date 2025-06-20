import { motion } from "motion/react";
import * as React from "react";

interface ParticlesBackgroundProps extends React.ComponentProps<"div"> {
  color?: string;
  count?: number;
}

const ParticlesBackground = ({
  color = "white",
  count = 18,
  ...props
}: ParticlesBackgroundProps) => {
  const [particles, setParticles] = React.useState<
    {
      top: number;
      left: number;
      size: number;
      opacity: number;
      delay: number;
    }[]
  >([]);

  React.useEffect(() => {
    setParticles(
      Array.from({ length: count }).map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.4,
        delay: Math.random() * 2,
      })),
    );
  }, [count]);

  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ overflow: "hidden" }}
      {...props}
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            filter: "blur(0.5px)",
            background: color,
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [p.opacity, p.opacity * 0.7, p.opacity],
          }}
          transition={{
            duration: 2.5 + Math.random() * 1.5,
            repeat: Infinity,
            delay: p.delay,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default ParticlesBackground;
