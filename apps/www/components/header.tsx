"use client";

import { motion } from "motion/react";

import GithubIcon from "@workspace/ui/components/icons/github-icon";
import XIcon from "@workspace/ui/components/icons/x-icon";
import config from "@workspace/ui/config";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { useEffect, useState } from "react";
import { Icons } from "./icons";
const LOGO_WRAPPER_VARIANTS = {
  center: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100vh",
  },
  topCenter: {
    top: 0,
    left: 0,
    right: 0,
    bottom: "auto",
    height: "auto",
  },
};

const logoVariants = (isScroll: boolean, isMobile: boolean) => ({
  center: {
    top: "50%",
    left: "50%",
    x: "-50%",
    y: "-50%",
    scale: 1,
  },
  topCenter: {
    top: isScroll ? (isMobile ? 4 : 0) : 20,
    left: isScroll ? (isMobile ? 0 : -40) : isMobile ? 0 : -30,
    x: 0,
    y: 0,
    scale: isScroll ? (isMobile ? 0.6 : 0.5) : 0.6,
  },
});

export const Header = ({ animation = false }: { animation?: boolean }) => {
  const isMobile = useIsMobile();
  const [isScroll, setIsScroll] = useState(false);
  const [transition, setTransition] = useState(!animation ? true : false);

  useEffect(() => {
    if (!animation) return;
    const timeout = setTimeout(() => setTransition(true), 1000);
    return () => clearTimeout(timeout);
  }, [animation]);

  useEffect(() => {
    const handleScroll = () => setIsScroll(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      variants={LOGO_WRAPPER_VARIANTS}
      initial="center"
      animate={transition ? "topCenter" : "center"}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      className="fixed z-40 flex items-center justify-center w-full"
    >
      <div className="relative max-w-7xl size-full">
        <motion.div
          className="absolute z-110 flex items-center justify-center w-fit"
          variants={logoVariants(isScroll, isMobile)}
          initial={transition ? "topCenter" : "center"}
          animate={transition ? "topCenter" : "center"}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          <Icons.logo
            size={isMobile ? "lg" : "xl"}
            draw={animation}
            text
            betaTag
          />
        </motion.div>

        <motion.div
          initial={{
            top: isScroll ? (isMobile ? 12 : 7.5) : 28,
            right: 0,
            opacity: 0,
          }}
          animate={
            transition
              ? {
                  top: isScroll ? (isMobile ? 12 : 7.5) : 28,
                  right: 20,
                  opacity: 1,
                }
              : {
                  top: isScroll ? (isMobile ? 12 : 7.5) : 28,
                  right: 0,
                  opacity: 0,
                }
          }
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          className="absolute z-110 flex items-center gap-x-4"
        >
          <div className="hidden sm:flex items-center gap-x-1">
            <a
              href={config.github.url}
              rel="noreferrer noopener"
              target="_blank"
              className="inline-flex sm:mt-1 items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 hover:bg-fd-accent hover:text-fd-accent-foreground p-1.5 [&_svg]:size-5 text-fd-muted-foreground sm:[&_svg]:size-5.5"
              data-active="false"
            >
              <GithubIcon />
            </a>
            <a
              href={config.x.url}
              rel="noreferrer noopener"
              target="_blank"
              className="inline-flex sm:mt-1 items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 hover:bg-fd-accent hover:text-fd-accent-foreground p-1.5 [&_svg]:size-5 text-fd-muted-foreground sm:[&_svg]:size-5.5"
              data-active="false"
            >
              <XIcon />
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
