"use client";

import config from "@workspace/ui/config";
import { cn } from "@workspace/ui/lib/utils";
import { easeInOut, motion, type SVGMotionProps } from "motion/react";

const pathVariants = {
  hidden: {
    pathLength: 0,
    fillOpacity: 0,
  },
  visible: {
    pathLength: 1,
    fillOpacity: 1,
    transition: {
      duration: 2,
      ease: easeInOut,
    },
  },
};

export const sizes = {
  sm: {
    svg: "h-6",
    betaTag: "px-1.5 py-0.5 text-[9px]",
    text: "text-md font-medium",
  },
  lg: {
    svg: "h-12",
    betaTag: "px-2 py-0.5 text-base",
    text: "text-lg font-medium",
  },
  xl: {
    svg: "h-14",
    betaTag: "px-2.5 py-1 text-base",
    text: "text-xl font-medium",
  },
};

export const Logo = ({
  betaTag = false,
  draw = false,
  text = false,
  size = "sm",
  className,
  containerClassName,
  haveStroke = false,
  ...props
}: {
  containerClassName?: string;
  betaTag?: boolean;
  draw?: boolean;
  text?: boolean;
  size?: keyof typeof sizes;
  haveStroke?: boolean;
} & SVGMotionProps<SVGSVGElement>) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        text ? "gap-4" : "gap-2",
        containerClassName,
      )}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 455 468"
        fill="none"
        className={cn(sizes[size].svg, className)}
        {...props}
      >
        <motion.path
          variants={draw ? pathVariants : {}}
          initial={draw ? "hidden" : false}
          animate={draw ? "visible" : false}
          d="M340.247 179.702C475.209 -51.5579 -12.291 -65.5579 143.747 187.702C-144.791 141.942 71.7093 613.942 225.709 353.442C357.209 577.442 594.209 187.702 340.247 179.702Z"
          fill={config.color.primary}
          stroke={haveStroke ? "black" : config.color.primary}
          strokeWidth={4}
        />
        <motion.path
          variants={draw ? pathVariants : {}}
          initial={draw ? "hidden" : false}
          animate={draw ? "visible" : false}
          d="M275.785 182.739C277.855 182.505 279.968 183.442 282.107 186.016C284.288 188.64 286.284 192.747 287.935 198.157C291.227 208.947 292.97 224.34 292.474 241.703L292.473 241.732V241.761C292.473 245.59 290.995 263.421 286.662 280.009C284.494 288.31 281.654 296.128 278.031 301.703C274.5 307.136 270.549 309.991 266.08 309.797L265.646 309.769C263.978 309.623 262.439 308.767 260.983 307.092C259.503 305.39 258.187 302.924 257.047 299.804C254.768 293.564 253.365 285.192 252.526 276.469C250.85 259.047 251.473 240.854 251.473 236.761C251.473 198.262 267.168 184.529 275.785 182.739Z"
          fill="white"
          stroke={haveStroke ? "black" : "white"}
          strokeWidth={4}
        />
        <motion.path
          variants={draw ? pathVariants : {}}
          initial={draw ? "hidden" : false}
          animate={draw ? "visible" : false}
          d="M204.171 183.181C206.241 182.946 208.355 183.883 210.494 186.457C212.675 189.082 214.671 193.189 216.322 198.599C219.613 209.388 221.357 224.781 220.861 242.145L220.86 242.174V242.202C220.86 246.032 219.382 263.862 215.049 280.45C212.881 288.751 210.04 296.569 206.417 302.145C202.887 307.578 198.936 310.433 194.467 310.238L194.033 310.21C192.365 310.065 190.826 309.208 189.37 307.533C187.89 305.832 186.574 303.365 185.434 300.245C183.155 294.006 181.751 285.633 180.913 276.91C179.237 259.488 179.86 241.296 179.86 237.202C179.86 198.703 195.554 184.97 204.171 183.181Z"
          fill="white"
          stroke={haveStroke ? "black" : "white"}
          strokeWidth={4}
        />
        <motion.path
          variants={draw ? pathVariants : {}}
          initial={draw ? "hidden" : false}
          animate={draw ? "visible" : false}
          d="M184.089 447.061C182.342 440.978 203.87 444.154 226.553 354C229.577 448.448 218.15 466.599 211.275 465.595C204.399 464.592 185.836 453.144 184.089 447.061Z"
          fill={config.color.primary}
          stroke={haveStroke ? "black" : config.color.primary}
          strokeWidth={4}
        />
      </motion.svg>

      {text && (
        <motion.span
          className={cn(sizes[size].text)}
          initial={draw ? { opacity: 0 } : undefined}
          animate={draw ? { opacity: 1 } : undefined}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          Target Blank
        </motion.span>
      )}

      {betaTag && (
        <motion.div
          className={cn(
            sizes[size].betaTag,
            "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full",
          )}
          initial={draw ? { opacity: 0 } : undefined}
          animate={draw ? { opacity: 1 } : undefined}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          Beta
        </motion.div>
      )}
    </div>
  );
};
