"use client";

import MotionIcon from "@workspace/ui/components/icons/motion-icon";
import ReactIcon from "@workspace/ui/components/icons/react-icon";
import ShadcnIcon from "@workspace/ui/components/icons/shadcn-icon";
import TailwindIcon from "@workspace/ui/components/icons/tailwind-icon";
import TSIcon from "@workspace/ui/components/icons/ts-icon";
import { Button } from "@workspace/ui/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export const Hero = () => {
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
          <button className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-[#59BF00] focus-visible:ring-[#59BF00]/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-secondary/80 px-4 py-2 has-[>svg]:px-3 bg-surface text-surface-foreground/60 dark:bg-card relative h-8 w-full justify-start pl-2.5 font-normal shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64">
            <span className="hidden lg:inline-flex">
              Search documentation...
            </span>
            <span className="inline-flex lg:hidden">Search...</span>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="bg-gray-50 dark:bg-gray-900 text-neutral-500 dark:text-neutral-400 pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3">
                ⌘
              </kbd>
              <kbd className="bg-gray-50 dark:bg-gray-900 text-neutral-500 dark:text-neutral-400 pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3">
                K
              </kbd>
            </div>
          </button>
        </div>

        <div className="sm:w-full lg:w-3/4 flex sm:flex-row flex-col sm:gap-5 gap-5 my-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-[#59BF00] px-5 text-white rounded-full"
              asChild
            >
              <Link href="/docs">
                Get Started <ArrowRightIcon className="!size-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-neutral-200 dark:bg-neutral-800 px-5 text-neutral-700 dark:text-neutral-300 rounded-full"
              asChild
            >
              <Link href="/docs/components">Browse Components</Link>
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
