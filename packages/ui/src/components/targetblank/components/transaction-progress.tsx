"use client";

import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

export type StepStatus = "idle" | "loading" | "complete";

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
}

function SpinnerCircle() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      style={{ width: 32, height: 32 }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="16"
          cy="16"
          r="11"
          fill="none"
          stroke="#333"
          strokeWidth="2"
          strokeDasharray="17 52"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

function CheckmarkCircle() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d="M9 16l5 5 9-9"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </svg>
  );
}

function StepCircle({
  index,
  status,
}: {
  index: number;
  status: StepStatus;
}) {
  const isComplete = status === "complete";
  const isLoading = status === "loading";

  return (
    <div
      className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300 bg-white"
      style={{
        borderColor: isComplete ? "#22c55e" : "#d1d5db",
      }}
    >
      {isComplete ? (
        <CheckmarkCircle />
      ) : isLoading ? (
        <SpinnerCircle />
      ) : (
        <span
          className="text-sm font-medium"
          style={{ color: "#9ca3af" }}
        >
          {index + 1}
        </span>
      )}
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
}: TransactionProgressProps) {
  // Find the active step (first non-complete, or last if all complete)
  const activeIndex = statuses.findIndex((s) => s !== "complete");
  const displayIndex = activeIndex === -1 ? statuses.length - 1 : activeIndex;

  const currentStep = steps[displayIndex];
  const currentStatus = statuses[displayIndex];

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Go back"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Close"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="px-5 pt-6 pb-5 flex flex-col gap-5">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-0">
          {steps.map((_, i) => (
            <React.Fragment key={i}>
              <StepCircle index={i} status={statuses[i] ?? "idle"} />
              {i < steps.length - 1 && (
                <div
                  className="flex-1 border-t-2 border-dashed mx-2"
                  style={{ borderColor: "#e5e7eb", minWidth: 32 }}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Status text */}
        <div className="text-center min-h-[44px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${displayIndex}-${currentStatus}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-1"
            >
              {currentStep && (
                <>
                  <p
                    className="text-base font-semibold text-gray-900 leading-snug"
                    style={{ fontSize: 16 }}
                  >
                    {currentStep.label}
                  </p>
                  <p
                    className="text-sm text-gray-500 leading-snug"
                    style={{ fontSize: 14 }}
                  >
                    {currentStep.description}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Details card */}
        {details && details.length > 0 && (
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#f9fafb" }}
          >
            {details.map((detail, i) => (
              <div key={i}>
                {i > 0 && (
                  <div
                    className="mx-4"
                    style={{ height: 1, background: "#e5e7eb" }}
                  />
                )}
                <div className="flex items-center justify-between px-4 py-3">
                  <span
                    className="text-sm text-gray-500"
                    style={{ fontSize: 13 }}
                  >
                    {detail.label}
                  </span>
                  <span
                    className="text-sm font-medium text-gray-900 flex items-center gap-1"
                    style={{ fontSize: 13 }}
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
