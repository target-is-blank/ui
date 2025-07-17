"use client";

import { Button } from "@workspace/ui/components/ui/button";
import { cn } from "@workspace/ui/lib/utils";
import {
  CheckIcon,
  Pen,
  RotateCcwIcon,
  KeyIcon as SignatureIcon,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  type HTMLMotionProps,
  LayoutGroup,
  motion,
} from "motion/react";
import * as React from "react";

enum SignatureState {
  START = "start",
  WRITING = "writing",
  END = "end",
}

interface SignaturePadProps {
  width: number;
  height: number;
  strokeStyle?: string;
  lineWidth?: number;
  className?: string;
}

type SignaturePadHandle = {
  clear: () => void;
  toDataURL: (type?: string, quality?: number) => string;
  isEmpty: () => boolean;
};

const SignaturePad = React.forwardRef<SignaturePadHandle, SignaturePadProps>(
  ({ width, height, strokeStyle = "#000", lineWidth = 2, className }, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);
    const drawing = React.useRef(false);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = width * 2;
      canvas.height = height * 2;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(2, 2);
      ctx.lineCap = "round";
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctxRef.current = ctx;
    }, [width, height, strokeStyle, lineWidth]);

    const getPos = (
      e: React.MouseEvent | React.TouchEvent,
    ): { x: number; y: number } => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const pt =
        "touches" in e
          ? (e as React.TouchEvent).touches[0]
          : (e as React.MouseEvent);
      return { x: pt.clientX - rect.left, y: pt.clientY - rect.top };
    };

    const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
      drawing.current = true;
      const { x, y } = getPos(e);
      ctxRef.current?.beginPath();
      ctxRef.current?.moveTo(x, y);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!drawing.current) return;
      const { x, y } = getPos(e);
      ctxRef.current?.lineTo(x, y);
      ctxRef.current?.stroke();
    };

    const handleUp = () => {
      drawing.current = false;
    };

    React.useImperativeHandle(ref, () => ({
      clear: () => ctxRef.current?.clearRect(0, 0, width, height),
      toDataURL: (type = "image/png", quality?: number) =>
        canvasRef.current!.toDataURL(type, quality),
      isEmpty: () => {
        const blank = document.createElement("canvas");
        blank.width = width;
        blank.height = height;
        return blank.toDataURL() === canvasRef.current!.toDataURL();
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className={cn("touch-none", className)}
        onMouseDown={handleDown}
        onMouseMove={handleMove}
        onMouseUp={handleUp}
        onMouseLeave={handleUp}
        onTouchStart={handleDown}
        onTouchMove={handleMove}
        onTouchEnd={handleUp}
      />
    );
  },
);
SignaturePad.displayName = "SignaturePad";

interface SignatureProps extends HTMLMotionProps<"div"> {
  width?: number;
  height?: number;
  strokeStyle?: string;
  lineWidth?: number;
  className?: string;
  preview?: boolean;
  onFinish?: (dataUrl: string) => void;
  onClear?: () => void;
  onStart?: () => void;
  onSignature?: () => void;
  onCancel?: () => void;
}

export const Signature = ({
  className,
  width = 128,
  height = 128,
  preview = false,
  strokeStyle = "#000",
  lineWidth = 2,
  onFinish,
  onClear,
  onStart,
  onSignature,
  onCancel,
  ...props
}: SignatureProps) => {
  const [signatureState, setSignatureState] = React.useState<SignatureState>(
    SignatureState.START,
  );

  const padRef = React.useRef<SignaturePadHandle | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = React.useState<string | null>(
    null,
  );

  const handleStart = () => {
    setSignatureState(SignatureState.WRITING);
    onStart?.();
  };

  const handleSignature = () => {
    if (!padRef.current || padRef.current.isEmpty()) return;
    setSignatureDataUrl(padRef.current.toDataURL());
    setSignatureState(SignatureState.END);
    onSignature?.();
  };

  const handleClear = () => {
    padRef.current?.clear();
    setSignatureDataUrl(null);
    onClear?.();
  };

  const handleCancel = () => {
    handleClear();
    setSignatureState(SignatureState.START);
    onCancel?.();
  };

  const handleFinish = () => {
    if (!signatureDataUrl) return;
    onFinish?.(signatureDataUrl);
  };

  return (
    <LayoutGroup id="signature">
      <motion.div layout className={className} {...props}>
        <AnimatePresence mode="wait" initial={false}>
          {signatureState === SignatureState.START && (
            <motion.div
              key="start"
              layoutId="signature-button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 150,
                bounce: 0.6,
              }}
            >
              <Button onClick={handleStart} className="w-full">
                <SignatureIcon className="size-4 mr-2" />
                Start Signing
              </Button>
            </motion.div>
          )}

          {signatureState === SignatureState.WRITING && (
            <motion.div
              key="writing"
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-primary/50 bg-background"
            >
              <div className="flex items-center justify-between gap-4 w-full">
                <button
                  className="p-2 aspect-square cursor-pointer"
                  onClick={handleClear}
                >
                  <RotateCcwIcon className="size-4" />
                </button>
                <span className="text-sm font-medium text-muted-foreground">
                  Sign here
                </span>
                <button
                  className="p-2 aspect-square cursor-pointer"
                  onClick={handleCancel}
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="w-full h-32 relative">
                <SignaturePad
                  ref={padRef as React.Ref<SignaturePadHandle>}
                  width={width}
                  height={height}
                  strokeStyle={strokeStyle}
                  lineWidth={lineWidth}
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              <motion.div
                layoutId="signature-button"
                className="w-full"
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                <Button className="w-full" onClick={handleSignature}>
                  <CheckIcon className="size-4 mr-2" />
                  Finish Signing
                </Button>
              </motion.div>
            </motion.div>
          )}

          {signatureState === SignatureState.END && (
            <motion.div
              key="end"
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              <motion.div
                layoutId="signature-button"
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                <Button
                  className="w-full"
                  variant="default"
                  onClick={handleFinish}
                >
                  <CheckIcon className="size-4 mr-2" />
                  Signature Complete
                </Button>
              </motion.div>

              <motion.button
                onClick={() => setSignatureState(SignatureState.WRITING)}
                className="aspect-square cursor-pointer border-1 rounded-lg p-2.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 150 }}
              >
                <Pen className="size-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {signatureState === SignatureState.END &&
          signatureDataUrl &&
          preview && (
            <motion.div
              className="mt-4 p-2 border rounded bg-muted/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.15 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={signatureDataUrl}
                alt="Signature preview"
                className="w-full h-16 object-contain"
              />
            </motion.div>
          )}
      </motion.div>
    </LayoutGroup>
  );
};
