"use client";

import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, X } from "lucide-react";
import * as React from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Step {
  label: string;
}

export interface DetailRow {
  label: string;
  value: React.ReactNode;
}

export interface MultiStepModalProps {
  title?: string;
  steps: Step[];
  currentStep: number;
  stepStatus: "loading" | "success" | "error";
  statusTitle: string;
  statusDescription?: string;
  details?: DetailRow[];
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
}

// ─── Spinning arc (loading state) ────────────────────────────────────────────

function SpinnerArc({ size = 52 }: { size?: number }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.25; // ~90° arc

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0"
    >
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#111827"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={`${arc} ${circ - arc}`}
        style={{ originX: `${size / 2}px`, originY: `${size / 2}px` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

// ─── Checkmark SVG (completion state) ────────────────────────────────────────

function AnimatedCheckmark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <motion.path
        d="M5 11.5L9 15.5L17 7"
        stroke="#22c55e"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </svg>
  );
}

// ─── Step circle ─────────────────────────────────────────────────────────────

interface StepCircleProps {
  index: number;
  currentStep: number;
  stepStatus: "loading" | "success" | "error";
}

function StepCircle({ index, currentStep, stepStatus }: StepCircleProps) {
  const isCompleted = index < currentStep;
  const isCurrent = index === currentStep;

  return (
    <div className="relative flex items-center justify-center w-[52px] h-[52px]">
      {/* Border circle */}
      <motion.div
        className="w-[44px] h-[44px] rounded-full flex items-center justify-center border-2"
        animate={{
          borderColor: isCompleted
            ? "#22c55e"
            : isCurrent
              ? "#d1d5db"
              : "#e5e7eb",
        }}
        transition={{ duration: 0.4 }}
        style={{ backgroundColor: "white" }}
      >
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <AnimatedCheckmark />
            </motion.div>
          ) : (
            <motion.span
              key="number"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "text-base font-semibold",
                isCurrent ? "text-gray-700" : "text-gray-400",
              )}
            >
              {index + 1}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Spinning arc overlay */}
      <AnimatePresence>
        {isCurrent && stepStatus === "loading" && (
          <motion.div
            key="spinner"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SpinnerArc size={52} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Animated connector line between steps ────────────────────────────────────

interface ConnectorProps {
  stepIndex: number; // connector between stepIndex and stepIndex+1
  currentStep: number;
}

function Connector({ stepIndex, currentStep }: ConnectorProps) {
  const filled = stepIndex < currentStep;

  return (
    <div
      className="relative flex-1 mx-2 mb-0 h-px overflow-hidden"
      style={{ marginBottom: 0 }}
    >
      {/* Dotted base */}
      <div className="absolute inset-0 border-t-2 border-dashed border-gray-200" />
      {/* Animated fill */}
      <motion.div
        className="absolute inset-0 bg-green-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: filled ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ originX: 0, height: 2, top: -1 }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MultiStepModal({
  title = "Deposit",
  steps,
  currentStep,
  stepStatus,
  statusTitle,
  statusDescription,
  details,
  onBack,
  onClose,
  className,
}: MultiStepModalProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-[32px] shadow-2xl w-[420px] mx-auto px-8 py-7 flex flex-col gap-7",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Go back"
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700",
            !onBack && "opacity-0 pointer-events-none",
          )}
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </button>
        <span className="font-bold text-gray-900 text-lg tracking-tight">
          {title}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700",
            !onClose && "opacity-0 pointer-events-none",
          )}
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center">
        {steps.map((step: Step, index: number) => (
          <React.Fragment key={step.label}>
            <StepCircle
              index={index}
              currentStep={currentStep}
              stepStatus={stepStatus}
            />
            {index < steps.length - 1 && (
              <Connector stepIndex={index} currentStep={currentStep} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Status text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStep}-${stepStatus}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="text-center flex flex-col gap-2"
          style={{ width: "356px" }}
        >
          <p
            className={cn(
              "text-xl font-bold",
              stepStatus === "error" ? "text-red-600" : "text-gray-900",
            )}
          >
            {statusTitle}
          </p>
          {statusDescription && (
            <p className="text-base text-gray-400 leading-relaxed">
              {statusDescription}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Details card */}
      {details && details.length > 0 && (
        <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
          {details.map((row: DetailRow, index: number) => (
            <React.Fragment key={row.label}>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-base text-gray-400">{row.label}</span>
                <span className="text-base text-gray-500 flex items-center gap-1.5">
                  {row.value}
                </span>
              </div>
              {index < details.length - 1 && (
                <div className="h-px bg-gray-100 mx-5" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
