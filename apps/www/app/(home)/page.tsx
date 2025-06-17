"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { cn } from "@workspace/ui/lib/utils";
import { motion, spring } from "motion/react";
import { useEffect, useState } from "react";

const CONTENT_VARIANTS = {
  hidden: {
    y: 2000,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: spring, stiffness: 100, damping: 30 },
  },
};

export default function HomePage() {
  const [transition, setTransition] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTransition(true), 2000);
    const timer2 = setTimeout(() => setIsLoaded(true), 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <main className={cn("relative h-dvh", !isLoaded && "overflow-y-hidden")}>
      <Header animation />

      <div className="h-dvh w-full flex items-center">
        <motion.div
          variants={CONTENT_VARIANTS}
          initial="hidden"
          animate={transition ? "visible" : "hidden"}
          className="w-full"
        >
          <Hero key={String(transition)} />
        </motion.div>
      </div>

      <div className="w-full max-w-7xl mx-auto pb-30 px-6"></div>

      <Footer />
    </main>
  );
}
