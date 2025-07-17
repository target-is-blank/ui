import { cn } from "@workspace/ui/lib/utils";
import React, { useEffect, useMemo, useState } from "react";

export interface NumberMosaicProps
  extends React.HTMLAttributes<HTMLPreElement> {
  value: number | string;
  random?: boolean;
  className?: string;
  gap?: number;
  charset?: string;
}

const DIGIT_PATTERNS: Record<string, string[]> = {
  "0": ["11111", "10001", "10001", "10001", "10001", "10001", "11111"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["11111", "00001", "00001", "11111", "10000", "10000", "11111"],
  "3": ["11111", "00001", "00001", "11111", "00001", "00001", "11111"],
  "4": ["10001", "10001", "10001", "11111", "00001", "00001", "00001"],
  "5": ["11111", "10000", "10000", "11111", "00001", "00001", "11111"],
  "6": ["11111", "10000", "10000", "11111", "10001", "10001", "11111"],
  "7": ["11111", "00001", "00001", "00010", "00100", "01000", "01000"],
  "8": ["11111", "10001", "10001", "11111", "10001", "10001", "11111"],
  "9": ["11111", "10001", "10001", "11111", "00001", "00001", "11111"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  " ": Array(7).fill("00000"),
  ".": ["00000", "00000", "00000", "00000", "00000", "00100", "00100"],
};

const ROWS = DIGIT_PATTERNS["0"].length;

function randomChar(charset: string): string {
  if (!charset) return "#";
  const idx = Math.floor(Math.random() * charset.length);
  return charset.charAt(idx);
}

export function buildNumberMosaic(
  value: number | string,
  random: boolean = false,
  gap: number = 1,
  charset: string = "0123456789",
): string {
  const str = String(value);
  const lineParts: string[][] = Array.from({ length: ROWS }, () => []);

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const pattern = DIGIT_PATTERNS[ch] ?? DIGIT_PATTERNS[" "];
    for (let r = 0; r < ROWS; r++) {
      const patRow = pattern[r];
      let outRow = "";
      for (let c = 0; c < patRow.length; c++) {
        if (patRow[c] === "1") {
          outRow += random ? randomChar(charset) : ch;
        } else {
          outRow += " ";
        }
      }
      lineParts[r].push(outRow);
    }

    if (i < str.length - 1) {
      const spacer = " ".repeat(Math.max(0, gap));
      for (let r = 0; r < ROWS; r++) {
        lineParts[r].push(spacer);
      }
    }
  }

  return lineParts.map((chunks) => chunks.join("")).join("\n");
}

export const NumberMosaic: React.FC<NumberMosaicProps> = ({
  value,
  random = false,
  gap = 1,
  className,
  charset = "0123456789",
  ...props
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const mosaic = useMemo(
    () => buildNumberMosaic(value, random && isClient, gap, charset),
    [value, random, gap, charset, isClient],
  );

  return (
    <pre
      aria-label={String(value)}
      className={cn("whitespace-pre leading-none", className)}
      {...props}
    >
      {mosaic}
    </pre>
  );
};

export default NumberMosaic;
