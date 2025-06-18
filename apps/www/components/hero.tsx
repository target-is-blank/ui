"use client";

import MotionIcon from "@workspace/ui/components/icons/motion-icon";
import ReactIcon from "@workspace/ui/components/icons/react-icon";
import ShadcnIcon from "@workspace/ui/components/icons/shadcn-icon";
import TailwindIcon from "@workspace/ui/components/icons/tailwind-icon";
import TSIcon from "@workspace/ui/components/icons/ts-icon";
import { Button } from "@workspace/ui/components/ui/button";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { FocusEvent, useCallback } from "react";

export const Hero = () => {
  const isMobile = useIsMobile();

  const handleKeyBoardEvent = useCallback(
    (_: FocusEvent<HTMLInputElement, Element>) => {
      const cmdKeyEvent = new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
      });
      window.dispatchEvent(cmdKeyEvent);
    },
    [],
  );

  return (
    <div className="relative mx-auto max-w-7xl px-6 pt-8 w-full flex flex-col gap-10">
      <div className="flex flex-col items-center sm:items-start lg:items-center justify-start gap-6 mt-8">
        <h1 className="sm:w-full lg:w-3/4 text-2xl md:text-3xl lg:text-4xl sm:text-start text-center font-semibold text-neutral-800 dark:text-white !leading-relaxed lg:!leading-snug">
          Discover, create and share popular UI/UX prebuild components
        </h1>

        <p className="sm:w-full lg:w-3/4 text-sm sm:text-start text-center text-neutral-500 dark:text-neutral-400">
          An open-source library with all your favorite components built for{" "}
          <strong>React, TypeScript</strong> with{" "}
          <strong>Tailwind CSS, Motion</strong> and <strong>Shadcn CLI</strong>.
          Browse a list of components you can install, modify, and use in your
          projects.
        </p>

        <div className="w-full sm:w-full lg:w-3/4 flex items-center justify-start relative">
          <input
            type="text"
            placeholder={isMobile ? "Search..." : "Search components..."}
            className="w-3/4 sm:w-1/2 mx-auto sm:mx-0 text-sm h-8 px-3 pr-[65px] rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#59BF00] focus:border-transparent"
            onFocus={handleKeyBoardEvent}
          />
          <div className="absolute right-[12%] sm:right-[49%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-1">
            <kbd className="bg-gray-50 dark:bg-gray-900 text-neutral-500 dark:text-neutral-400 pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3">
              ⌘
            </kbd>
            <kbd className="bg-gray-50 dark:bg-gray-900 text-neutral-500 dark:text-neutral-400 pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3">
              K
            </kbd>
          </div>
        </div>

        <div className="sm:w-full lg:w-3/4 flex sm:flex-row flex-col sm:gap-4 gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-[#59BF00] text-white text-sm px-3 py-1.5"
              asChild
            >
              <Link href="/docs" className="p-0 h-fit">
                Get Started <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 text-sm text-neutral-700 dark:text-neutral-300 h-10"
              asChild
            >
              <Link href="/docs/components" className="p-0 h-fit">
                Browse Components
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="sm:w-full lg:w-3/4 flex items-center gap-4 justify-center sm:justify-start">
          <ReactIcon className="size-8" />
          <TSIcon className="size-8" />
          <TailwindIcon className="size-8" />
          <MotionIcon className="size-12" />
          <ShadcnIcon className="size-8" />
        </div>
      </div>
    </div>
  );
};
