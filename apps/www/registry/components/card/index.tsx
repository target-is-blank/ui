import { cn } from "@workspace/ui/lib/utils";
import { HTMLMotionProps, motion } from "motion/react";
import * as React from "react";
import { useRef, useState } from "react";

const DEFAULT_COMPONENT = "button";

type CardProps = HTMLMotionProps<"div"> & {
  image: string;
};

function Card({ className, image, ...props }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const strength = 0.08;
    setPos({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <div
      data-slot="card"
      className="flex justify-center items-center p-2 rounded-3xl shadow-sm bg-white/20 backdrop-blur-xs"
    >
      <motion.div
        ref={cardRef}
        className={cn(
          "relative w-[300px] bg-cover bg-center flex flex-col gap-4 p-6 rounded-2xl shadow-[inset_0px_0px_3px_0px_#FFFFFF]",
          className,
        )}
        style={{
          backgroundImage: `url(${image})`,
        }}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    </div>
  );
}

function CardGradient({
  className,
  from = "rgba(255,255,255,0.70) 0%",
  to = "transparent 80%",
  ...props
}: React.ComponentProps<"div"> & {
  from?: string;
  to?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 rounded-2xl pointer-events-none",
        className,
      )}
      style={{
        background: `linear-gradient(to bottom, ${from}, ${to})`,
      }}
      {...props}
    />
  );
}

function CardIndicator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-indicator"
      className={cn(
        "rounded-full border border-gray-200 bg-white/30 backdrop-blur-xs w-fit",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-1 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-semibold leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-1", className)}
      {...props}
    />
  );
}

type CardFooterProps<T extends React.ElementType = typeof DEFAULT_COMPONENT> = {
  as?: T;
  radius?: number;
  blur?: number;
  childClassName?: string;
} & React.ComponentProps<T>;

function CardFooter<T extends React.ElementType = typeof DEFAULT_COMPONENT>({
  as,
  className,
  ...props
}: CardFooterProps<T>) {
  const Comp = as || DEFAULT_COMPONENT;

  return (
    <motion.div
      data-slot="card-footer"
      className="flex overflow-hidden relative justify-center items-center p-1 mt-20 rounded-xl backdrop-blur-sm bg-white/20 shadow-[inset_0px_0px_2px_0px_#FFFFFF]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Comp
        className={cn(
          "flex overflow-hidden relative z-10 items-center w-full h-full text-sm text-center text-gray-700 shadow-[inset_0px_0px_2px_0px_#FFFFFF]",
          className,
        )}
        {...props}
      >
        {props.children}
      </Comp>
    </motion.div>
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardGradient,
  CardHeader,
  CardIndicator,
  CardTitle,
};
