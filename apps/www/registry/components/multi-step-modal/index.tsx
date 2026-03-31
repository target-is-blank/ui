"use client";

import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, X, Check, AlertCircle } from "lucide-react";
import * as React from "react";

export interface Step {
  label: string;
}

export interface DetailRow {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
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

// Spinning arc SVG for the loading state
const SpinningArc = () => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  // ~270° arc
  const dashArray = (270 / 360) * circumference;
  const dashOffset = 0;

  return (
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      style={{ originX: "50%", originY: "50%", transformOrigin: "24px 24px" }}
    >
      <circle
        cx={24}
        cy={24}
        r={radius}
        fill="none"
        stroke="#111827"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={`${dashArray} ${circumference - dashArray}`}
        strokeDashoffset={dashOffset}
      />
    </motion.g>
  );
};

interface StepCircleProps {
  index: number;
  currentStep: number;
  stepStatus: "loading" | "success" | "error";
}

const StepCircle = ({ index, currentStep, stepStatus }: StepCircleProps) => {
  const isCompleted = index < currentStep;
  const isCurrent = index === currentStep;
  const isActive = isCurrent;

  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      {/* Base circle */}
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
          isCompleted
            ? "bg-green-500 border-green-500"
            : isActive
              ? "bg-white border-gray-200"
              : "bg-gray-100 border-gray-200",
        )}
      >
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </motion.div>
          ) : isActive && stepStatus === "error" ? (
            <motion.div
              key="error"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <AlertCircle className="w-4 h-4 text-red-500" />
            </motion.div>
          ) : (
            <motion.span
              key="number"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "text-sm font-semibold",
                isActive ? "text-gray-800" : "text-gray-400",
              )}
            >
              {index + 1}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Spinning arc overlay for loading state */}
      <AnimatePresence>
        {isActive && stepStatus === "loading" && (
          <motion.div
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg
              width={48}
              height={48}
              viewBox="0 0 48 48"
              className="absolute inset-0"
            >
              <SpinningArc />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MultiStepModal = ({
  title = "Processing",
  steps,
  currentStep,
  stepStatus,
  statusTitle,
  statusDescription,
  details,
  onBack,
  onClose,
  className,
}: MultiStepModalProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-auto p-6 flex flex-col gap-6",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Go back"
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500",
            !onBack && "opacity-0 pointer-events-none",
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-bold text-gray-900 text-base">{title}</span>
        <button
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500",
            !onClose && "opacity-0 pointer-events-none",
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-0">
        {steps.map((step: Step, index: number) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1.5">
              <StepCircle
                index={index}
                currentStep={currentStep}
                stepStatus={stepStatus}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  index < currentStep
                    ? "text-green-600"
                    : index === currentStep
                      ? "text-gray-800"
                      : "text-gray-400",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="flex-1 border-t-2 border-dashed border-gray-200 mx-2 mb-6"
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Status text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStep}-${stepStatus}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="text-center flex flex-col gap-1"
        >
          <p
            className={cn(
              "text-sm font-semibold",
              stepStatus === "error" ? "text-red-600" : "text-gray-900",
            )}
          >
            {statusTitle}
          </p>
          {statusDescription && (
            <p className="text-xs text-gray-500">{statusDescription}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Details card */}
      {details && details.length > 0 && (
        <div className="bg-gray-50 rounded-2xl overflow-hidden">
          {details.map((row: DetailRow, index: number) => (
            <React.Fragment key={row.label}>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  {row.icon && (
                    <span className="flex-shrink-0">{row.icon}</span>
                  )}
                  {row.label}
                </div>
                <div className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                  {row.value}
                </div>
              </div>
              {index < details.length - 1 && (
                <div className="h-px bg-gray-200 mx-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiStepModal;
