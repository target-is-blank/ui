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

const THEMES = {
  light: {
    surface: "#FFFFFF",
    stepSurface: "#FFFFFF",
    border: "#D7D9DE",
    mutedText: "#8E949F",
    bodyText: "#17191C",
    hairline: "#EEF0F3",
    cardBg: "#FBFBFC",
    icon: "#8B9099",
    shadow: "0 14px 32px rgba(15, 23, 42, 0.06), 0 2px 8px rgba(15, 23, 42, 0.03)",
  },
  dark: {
    surface: "#171A1F",
    stepSurface: "#171A1F",
    border: "#3A404A",
    mutedText: "#A4ABB6",
    bodyText: "#F3F5F7",
    hairline: "#2A2F38",
    cardBg: "#1D2128",
    icon: "#98A0AA",
    shadow: "0 18px 48px rgba(0, 0, 0, 0.34), 0 2px 10px rgba(0, 0, 0, 0.22)",
  },
} as const;

type ThemeTokens = (typeof THEMES)[TransactionProgressTheme];

function SpinnerCircle() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.35, repeat: Infinity, ease: "linear" }}
      style={{ width: 56, height: 56, position: "absolute" }}
    >
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <circle
          cx="28"
          cy="28"
          r="24"
          fill="none"
          stroke={ACCENT_GREEN}
          strokeWidth="2.25"
          strokeDasharray="26 124"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

function CheckmarkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <motion.path
        d="M4.5 11.5l5 5 8-9"
        stroke={ACCENT_GREEN}
        strokeWidth="2.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
      />
    </svg>
  );
}

function StepCircle({
  index,
  status,
  tokens,
}: {
  index: number;
  status: StepStatus;
  tokens: ThemeTokens;
}) {
  const isComplete = status === "complete";
  const isLoading = status === "loading";

  return (
    <div
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
      <div
        style={{
          position: "absolute",
          inset: 2,
          borderRadius: "50%",
          border: `${isComplete ? 2.5 : 2}px solid ${isComplete ? ACCENT_GREEN : tokens.border}`,
          background: tokens.stepSurface,
          transition: "border-color 0.3s ease, border-width 0.3s ease, background-color 0.3s ease",
        }}
      />
      {isLoading && <SpinnerCircle />}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isComplete ? (
          <CheckmarkIcon />
        ) : (
          <span
            style={{
              fontSize: 17,
              fontWeight: 500,
              color: tokens.mutedText,
              lineHeight: 1,
            }}
          >
            {index + 1}
          </span>
        )}
      </div>
    </div>
  );
}

function DotsConnector({ leftComplete, tokens }: { leftComplete: boolean; tokens: ThemeTokens }) {
  const dots = [0, 1, 2, 3, 4];

  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginLeft: 10,
        marginRight: 10,
        flexShrink: 0,
      }}
    >
      {dots.map((i) => {
        const active = leftComplete && i < 3;
        return (
          <motion.div
            key={i}
            initial={false}
            animate={{ backgroundColor: active ? ACCENT_GREEN : tokens.border, scale: active ? 1 : 0.96 }}
            transition={{ duration: 0.24, delay: i * 0.045, ease: "easeOut" }}
            style={{
              width: 4,
              height: 4,
              borderRadius: "999px",
            }}
          />
        );
      })}
    </div>
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
    <div
      className={cn("overflow-hidden", className)}
      style={{
        width: 416,
        minWidth: 416,
        maxWidth: 416,
        borderRadius: 26,
        background: tokens.surface,
        boxShadow: tokens.shadow,
        transition: "background-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 22px 12px",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: tokens.icon,
            padding: 0,
          }}
          aria-label="Go back"
        >
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none" aria-hidden="true">
            <path d="M8 1L2 7.5L8 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 600, color: tokens.bodyText, letterSpacing: "-0.02em" }}>{title}</span>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: tokens.icon,
            padding: 0,
          }}
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div style={{ padding: "28px 26px 26px", display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
          {steps.map((_, i) => (
            <React.Fragment key={i}>
              <StepCircle index={i} status={statuses[i] ?? "idle"} tokens={tokens} />
              {i < steps.length - 1 && <DotsConnector leftComplete={statuses[i] === "complete"} tokens={tokens} />}
            </React.Fragment>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            width: "100%",
            minHeight: 72,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 12px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${displayIndex}-${currentStatus}`}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
            >
              {currentStep && (
                <>
                  <p
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: tokens.bodyText,
                      margin: 0,
                      lineHeight: 1.2,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {currentStep.label}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: tokens.mutedText,
                      margin: 0,
                      lineHeight: 1.45,
                      maxWidth: 248,
                    }}
                  >
                    {currentStep.description}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {details && details.length > 0 && (
          <div
            style={{
              background: tokens.cardBg,
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${tokens.hairline}`,
            }}
          >
            {details.map((detail, i) => (
              <div key={i}>
                {i > 0 && <div style={{ height: 1, background: tokens.hairline, margin: "0 18px" }} />}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    gap: 16,
                  }}
                >
                  <span style={{ fontSize: 14, color: tokens.mutedText, lineHeight: 1.2 }}>{detail.label}</span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: detail.label === "Fill status" ? tokens.mutedText : tokens.bodyText,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      lineHeight: 1.2,
                    }}
                  >
                    {detail.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionProgress;
