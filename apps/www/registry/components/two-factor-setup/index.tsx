"use client";

import { cn } from "@workspace/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TwoFactorSetupProps {
  /** The backup code to display */
  backupCode?: string;
  /** QR code image src (URL or data URI) */
  qrSrc?: string;
  /** Called when user submits a 6-digit token */
  onVerify?: (token: string) => void | Promise<void>;
  /** Called when user clicks Cancel */
  onCancel?: () => void;
  /** Called when user clicks the X close button */
  onClose?: () => void;
  className?: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CornerBrackets({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {/* Top-left */}
      <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-teal-400 rounded-tl" />
      {/* Top-right */}
      <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-teal-400 rounded-tr" />
      {/* Bottom-left */}
      <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-teal-400 rounded-bl" />
      {/* Bottom-right */}
      <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-teal-400 rounded-br" />
    </div>
  );
}

function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, #2dd4bf 20%, #5eead4 50%, #2dd4bf 80%, transparent 100%)",
        boxShadow: "0 0 8px 2px rgba(45, 212, 191, 0.5)",
      }}
      initial={{ top: "8%" }}
      animate={{ top: ["8%", "92%", "8%"] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Stable seed-based pseudo-random (no Math.random() on render)
// Deterministic bit for data modules
function seedBit(c: number, r: number): boolean {
  const n = Math.sin(c * 92.3 + r * 157.6 + c * r * 0.37) * 43758.5453;
  return n - Math.floor(n) > 0.5;
}

// Build a QR V1-like 21×21 matrix (finder patterns + timing + seeded data)
function buildQRMatrix(): boolean[][] {
  const S = 21;
  const m: boolean[][] = Array.from({ length: S }, () => Array(S).fill(false));

  // Finder pattern (7×7): ring 0 & 2 = dark, ring 1 = light
  const finder = (row: number, col: number) => {
    for (let dr = 0; dr < 7; dr++)
      for (let dc = 0; dc < 7; dc++) {
        const ring = Math.max(Math.abs(dr - 3), Math.abs(dc - 3));
        m[row + dr][col + dc] = ring !== 1;
      }
  };
  finder(0, 0);
  finder(0, 14);
  finder(14, 0);

  // Timing patterns (row 6 / col 6, between finders)
  for (let i = 8; i <= 12; i++) {
    m[6][i] = i % 2 === 0;
    m[i][6] = i % 2 === 0;
  }

  // Fill remaining cells with seeded data
  for (let r = 0; r < S; r++) {
    for (let c = 0; c < S; c++) {
      if (r < 8 && c < 8) continue;   // TL finder + separator
      if (r < 8 && c >= 13) continue; // TR finder + separator
      if (r >= 13 && c < 8) continue; // BL finder + separator
      if (r === 6 || c === 6) continue; // timing (already set)
      m[r][c] = seedBit(c, r);
    }
  }
  return m;
}

const QR_MATRIX = buildQRMatrix();

function PlaceholderQR() {
  return (
    <svg viewBox="0 0 21 21" className="w-full h-full" shapeRendering="crispEdges">
      <rect width="21" height="21" fill="#141414" />
      {QR_MATRIX.flatMap((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="white" />
          ) : null,
        ),
      )}
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TwoFactorSetup({
  backupCode = "ORBT-7X92-KLL9-001P",
  qrSrc,
  onVerify,
  onCancel,
  onClose,
  className,
}: TwoFactorSetupProps) {
  const [otp, setOtp] = React.useState<string[]>(Array(6).fill(""));
  const [copied, setCopied] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(backupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [backupCode]);

  const handleOtpChange = React.useCallback(
    (index: number, value: string) => {
      // Allow paste of full code
      if (value.length > 1) {
        const digits = value.replace(/\D/g, "").slice(0, 6).split("");
        const next = [...otp];
        digits.forEach((d, i) => {
          if (index + i < 6) next[index + i] = d;
        });
        setOtp(next);
        const focusIdx = Math.min(index + digits.length, 5);
        inputRefs.current[focusIdx]?.focus();
        return;
      }

      const digit = value.replace(/\D/g, "");
      const next = [...otp];
      next[index] = digit;
      setOtp(next);
      if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    },
    [otp],
  );

  const handleOtpKeyDown = React.useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handleContinue = React.useCallback(async () => {
    const token = otp.join("");
    if (token.length < 6) return;
    setLoading(true);
    try {
      await onVerify?.(token);
    } finally {
      setLoading(false);
    }
  }, [otp, onVerify]);

  const isComplete = otp.every((d) => d !== "");

  return (
    <div
      className={cn(
        "flex rounded-2xl overflow-hidden shadow-2xl w-full max-w-[660px]",
        "bg-[#1a1a1a]",
        className,
      )}
    >
      {/* ── Left panel ──────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center gap-5 w-[45%] px-8 py-10 bg-[#141414]">
        {/* QR frame */}
        <div className="relative w-52 h-52">
          <CornerBrackets />
          <div className="absolute inset-3 overflow-hidden rounded">
            {qrSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrSrc} alt="QR Code" className="w-full h-full object-contain" />
            ) : (
              <PlaceholderQR />
            )}
            <ScanLine />
          </div>
        </div>

        {/* Caption */}
        <div className="text-center">
          <p className="text-white font-semibold text-base tracking-wide">
            Secure Protocol
          </p>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed max-w-[180px]">
            Position your camera within the frame to authorize this session.
          </p>
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col justify-center px-8 py-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold mb-1">2FA Setup</h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Scan with your authenticator app to enable Level 4 access.
        </p>

        {/* Backup code */}
        <div className="mb-5">
          <p className="text-white text-xs font-medium mb-2">Manual Backup Code</p>
          <div className="flex items-center gap-2 bg-[#0d0d0d] border border-teal-500/40 rounded-lg px-4 py-3">
            <span className="flex-1 font-mono text-teal-300 text-sm tracking-widest">
              {backupCode}
            </span>
            <button
              onClick={handleCopy}
              className="text-teal-400 hover:text-teal-300 transition-colors flex-shrink-0"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.svg
                    key="check"
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <path d="M3 8l3.5 3.5L13 4" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="copy"
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            Use this code if you&apos;re unable to scan the QR graphic.
          </p>
        </div>

        {/* OTP input */}
        <div className="mb-6">
          <p className="text-white text-xs font-medium mb-3">Verification Token</p>
          <div className="flex gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className={cn(
                  "w-10 h-10 rounded-lg text-center text-white font-semibold text-sm",
                  "bg-[#252525] border border-transparent outline-none",
                  "transition-all duration-150",
                  "focus:border-teal-500/60 focus:bg-[#1e1e1e]",
                  digit && "border-teal-500/30",
                )}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>

          <motion.button
            onClick={handleContinue}
            disabled={!isComplete || loading}
            className={cn(
              "flex-1 py-2.5 rounded-full font-semibold text-sm transition-opacity",
              "bg-gradient-to-r from-teal-300 to-teal-400 text-gray-900",
              (!isComplete || loading) && "opacity-40 cursor-not-allowed",
            )}
            style={{
              boxShadow: isComplete
                ? "0 0 20px rgba(45, 212, 191, 0.35), 0 0 40px rgba(45, 212, 191, 0.15)"
                : "none",
            }}
            whileTap={isComplete ? { scale: 0.97 } : undefined}
          >
            {loading ? "Verifying…" : "Continue"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
