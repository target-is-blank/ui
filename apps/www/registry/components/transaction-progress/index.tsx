"use client";

import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

export type StepStatus = "idle" | "loading" | "complete";
export type TransactionProgressTheme = "light" | "dark";

export interface TransactionStep {
  label: string;
  description: string;
}

export interface TransactionDetail {
  label: string;
  value: React.ReactNode;
}

export interface TransactionProgressProps {
  title?: string;
  steps: TransactionStep[];
  statuses: StepStatus[];
  details?: TransactionDetail[];
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
  theme?: TransactionProgressTheme;
}

const ACCENT_GREEN = "#45B649";
const LOADING_STROKE = "#17191C";

const THEMES = {
  light: {
    surface: "#FFFFFF",
    ring: "#D9DDE3",
    mutedText: "#8E949F",
    stepText: "#8E949F",
    bodyText: "#17191C",
    hairline: "#EEF0F3",
    cardBg: "#FBFBFC",
    icon: "#8B9099",
    connector: "#D7D9DE",
    shadow: "0 14px 32px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.03)",
  },
  dark: {
    surface: "#171A1F",
    ring: "#444B56",
    mutedText: "#A4ABB6",
    stepText: "#A4ABB6",
    bodyText: "#F3F5F7",
    hairline: "#2A2F38",
    cardBg: "#1D2128",
    icon: "#98A0AA",
    connector: "#3A404A",
    shadow: "0 18px 48px rgba(0, 0, 0, 0.34), 0 2px 10px rgba(0, 0, 0, 0.22)",
  },
} as const;

type ThemeTokens = (typeof THEMES)[TransactionProgressTheme];

function LoadingRing({ tokens }: { tokens: ThemeTokens }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.35, repeat: Infinity, ease: "linear" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <circle cx="28" cy="28" r="20.5" fill="none" stroke={tokens.ring} strokeWidth="1.9" />
        <circle
          cx="28"
          cy="28"
          r="20.5"
          fill="none"
          stroke={LOADING_STROKE}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="18 132"
        />
      </svg>
    </motion.div>
  );
}

function IdleRing({ tokens }: { tokens: ThemeTokens }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
      <circle cx="28" cy="28" r="20.5" fill="none" stroke={tokens.ring} strokeWidth="1.9" />
    </svg>
  );
}

function CompleteRing() {
  return (
    <motion.svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0 }}
      initial={{ opacity: 0.7, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <circle cx="28" cy="28" r="20.5" fill="none" stroke={ACCENT_GREEN} strokeWidth="1.95" />
    </motion.svg>
  );
}

function CheckmarkIcon() {
  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <motion.path
        d="M4.25 10.5l4 4 7-7.5"
        stroke={ACCENT_GREEN}
        strokeWidth="2.05"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.34, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

function StepCircle({ index, status, tokens }: { index: number; status: StepStatus; tokens: ThemeTokens }) {
  const isComplete = status === "complete";
  const isLoading = status === "loading";

  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        width: 56,
        height: 56,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isComplete ? <CompleteRing /> : isLoading ? <LoadingRing tokens={tokens} /> : <IdleRing tokens={tokens} />}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isComplete ? "complete" : `idle-${index}`}
          initial={{ opacity: 0, scale: 0.96, y: 1 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -1 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {isComplete ? (
            <CheckmarkIcon />
          ) : (
            <span style={{ fontSize: 17, fontWeight: 500, color: tokens.stepText, lineHeight: 1 }}>
              {index + 1}
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function DotsConnector({ leftStatus, tokens }: { leftStatus: StepStatus; tokens: ThemeTokens }) {
  const dots = [0, 1, 2, 3, 4];
  const activeCount = leftStatus === "complete" ? 3 : 0;
  const pulsing = leftStatus === "loading" ? 0 : -1;

  return (
    <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 10, marginRight: 10, flexShrink: 0 }}>
      {dots.map((i) => {
        const active = i < activeCount;
        return (
          <motion.div
            key={i}
            initial={false}
            animate={{
              backgroundColor: active ? ACCENT_GREEN : tokens.connector,
              opacity: active ? 1 : 0.88,
              scale: pulsing === i ? [0.96, 1.12, 0.96] : active ? 1 : 0.96,
            }}
            transition={{
              backgroundColor: { duration: 0.2, delay: i * 0.03, ease: "easeOut" },
              opacity: { duration: 0.2, delay: i * 0.03, ease: "easeOut" },
              scale: pulsing === i ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.18, ease: "easeOut" },
            }}
            style={{ width: 4, height: 4, borderRadius: "999px" }}
          />
        );
      })}
    </div>
  );
}

function ProcessingValue({ children, muted }: { children: React.ReactNode; muted: string }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span>{children}</span>
      <motion.span
        aria-hidden="true"
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ display: "inline-flex", gap: 3, alignItems: "center" }}
      >
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            animate={{ y: [0, -1.5, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: dot * 0.12 }}
            style={{ width: 3, height: 3, borderRadius: 999, background: muted, display: "block" }}
          />
        ))}
      </motion.span>
    </span>
  );
}

export function TransactionProgress({
  title = "Deposit",
  steps,
  statuses,
  details,
  onBack,
  onClose,
  className,
  theme = "light",
}: TransactionProgressProps) {
  const activeIndex = statuses.findIndex((s) => s !== "complete");
  const displayIndex = activeIndex === -1 ? statuses.length - 1 : activeIndex;
  const currentStep = steps[displayIndex];
  const currentStatus = statuses[displayIndex];
  const tokens = THEMES[theme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className={cn("overflow-hidden", className)}
      style={{ width: 416, minWidth: 416, maxWidth: 416, borderRadius: 26, background: tokens.surface, boxShadow: tokens.shadow, transition: "background-color 0.3s ease, box-shadow 0.3s ease" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px 12px" }}>
        <motion.button whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.16, ease: "easeOut" }} type="button" onClick={onBack} style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: tokens.icon, padding: 0 }} aria-label="Go back">
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none" aria-hidden="true"><path d="M8 1L2 7.5L8 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.button>
        <span style={{ fontSize: 15, fontWeight: 600, color: tokens.bodyText, letterSpacing: "-0.02em" }}>{title}</span>
        <motion.button whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.16, ease: "easeOut" }} type="button" onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: tokens.icon, padding: 0 }} aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        </motion.button>
      </div>

      <div style={{ padding: "28px 26px 26px", display: "flex", flexDirection: "column", gap: 26 }}>
        <motion.div layout transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }} style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
          {steps.map((_, i) => (
            <React.Fragment key={i}>
              <StepCircle index={i} status={statuses[i] ?? "idle"} tokens={tokens} />
              {i < steps.length - 1 && <DotsConnector leftStatus={statuses[i] ?? "idle"} tokens={tokens} />}
            </React.Fragment>
          ))}
        </motion.div>

        <div style={{ textAlign: "center", width: "100%", minHeight: 72, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 12px" }}>
          <AnimatePresence mode="wait">
            <motion.div key={`${displayIndex}-${currentStatus}`} initial={{ opacity: 0, y: 8, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -6, filter: "blur(2px)" }} transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              {currentStep && (
                <>
                  <p style={{ fontSize: 17, fontWeight: 600, color: tokens.bodyText, margin: 0, lineHeight: 1.2, letterSpacing: "-0.03em" }}>{currentStep.label}</p>
                  <p style={{ fontSize: 14, color: tokens.mutedText, margin: 0, lineHeight: 1.45, maxWidth: 248 }}>{currentStep.description}</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {details && details.length > 0 && (
          <motion.div layout transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }} style={{ background: tokens.cardBg, borderRadius: 16, overflow: "hidden", border: `1px solid ${tokens.hairline}` }}>
            {details.map((detail, i) => {
              const isFillStatus = typeof detail.label === "string" && detail.label.toLowerCase() === "fill status";
              const isProcessing = isFillStatus && typeof detail.value === "string" && detail.value.toLowerCase() === "processing";
              return (
                <motion.div key={i} layout transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                  {i > 0 && <div style={{ height: 1, background: tokens.hairline, margin: "0 18px" }} />}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", gap: 16 }}>
                    <span style={{ fontSize: 14, color: tokens.mutedText, lineHeight: 1.2 }}>{detail.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: isFillStatus ? tokens.mutedText : tokens.bodyText, display: "flex", alignItems: "center", gap: 5, lineHeight: 1.2 }}>
                      {isProcessing ? <ProcessingValue muted={tokens.mutedText}>{detail.value}</ProcessingValue> : detail.value}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default TransactionProgress;
