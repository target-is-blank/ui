"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/ui/tabs";
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isSameDay,
  startOfDay,
  startOfMonth,
  subDays,
} from "date-fns";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DateRangeTimelineProps {
  value?: { from: Date; to: Date };
  onChange?: (range: { from: Date; to: Date }) => void;
  className?: string;
  /** How many days back to show in the timeline. Default: 120 */
  historyDays?: number;
}

interface Preset {
  label: string;
  getDates: () => { from: Date; to: Date };
  matchByDays?: number; // if set, match by day count instead of exact dates
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SPRING = { type: "spring", stiffness: 380, damping: 38 } as const;
const SCROLL_STEP = 30;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildPresets(today: Date): Preset[] {
  return [
    {
      label: "This month",
      getDates: () => ({ from: startOfMonth(today), to: today }),
    },
    {
      label: "7D",
      getDates: () => ({ from: subDays(today, 6), to: today }),
      matchByDays: 7,
    },
    {
      label: "30D",
      getDates: () => ({ from: subDays(today, 29), to: today }),
      matchByDays: 30,
    },
    {
      label: "90D",
      getDates: () => ({ from: subDays(today, 89), to: today }),
      matchByDays: 90,
    },
  ];
}

function isSameRange(
  a: { from: Date; to: Date },
  b: { from: Date; to: Date },
): boolean {
  return isSameDay(a.from, b.from) && isSameDay(a.to, b.to);
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DateRangeTimeline({
  value,
  onChange,
  className,
  historyDays = 120,
}: DateRangeTimelineProps) {
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const presets = React.useMemo(() => buildPresets(today), [today]);

  // Internal range state (used when uncontrolled)
  const [internalRange, setInternalRange] = React.useState<{
    from: Date;
    to: Date;
  }>(() => value ?? { from: startOfMonth(today), to: today });

  const range = value ?? internalRange;

  const setRange = React.useCallback(
    (r: { from: Date; to: Date }) => {
      setInternalRange(r);
      onChange?.(r);
    },
    [onChange],
  );

  // How far back to scroll (in extra days beyond historyDays)
  const [scrollOffset, setScrollOffset] = React.useState(0);
  const scrollLevel = scrollOffset / SCROLL_STEP; // 0, 1 or 2

  const handleScrollBack = React.useCallback(() => {
    setScrollOffset((prev) =>
      prev >= SCROLL_STEP * 2 ? 0 : prev + SCROLL_STEP,
    );
  }, []);

  // Full timeline: from (historyDays + scrollOffset) ago → today
  const timelineDays = React.useMemo(() => {
    const start = subDays(today, historyDays - 1 + scrollOffset);
    return eachDayOfInterval({ start, end: today });
  }, [today, historyDays, scrollOffset]);

  const totalDays = timelineDays.length;
  const oldest = timelineDays[0];

  // Convert date → percentage (0–100) along the timeline
  const dateToPct = React.useCallback(
    (date: Date) => {
      const idx = differenceInCalendarDays(date, oldest);
      return (
        (Math.max(0, Math.min(totalDays - 1, idx)) / (totalDays - 1)) * 100
      );
    },
    [oldest, totalDays],
  );

  // Convert clientX → date using live container rect
  const containerRef = React.useRef<HTMLDivElement>(null);

  const xToDate = React.useCallback(
    (clientX: number, rect: DOMRect) => {
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const dayIdx = Math.round(pct * (totalDays - 1));
      return timelineDays[dayIdx];
    },
    [timelineDays, totalDays],
  );

  // ── Drag state stored in a ref to avoid stale closures ──────────────────
  const dragRef = React.useRef<{
    mode: "resize-left" | "resize-right" | "move";
    startClientX: number;
    startFrom: Date;
    startTo: Date;
    duration: number; // days, for move mode
  } | null>(null);

  // ── Derived display values (needed before drag handlers) ───────────────
  const startPct = dateToPct(range.from);
  const endPct = dateToPct(range.to);
  const bandWidthPct = endPct - startPct;

  // Show "Days" label only if the band is wide enough
  const bandPx =
    (bandWidthPct / 100) * (containerRef.current?.offsetWidth ?? 600);
  const showDaysWord = bandPx > 52;

  const EDGE_HIT_PX = 8;
  const bandRef = React.useRef<HTMLDivElement>(null);
  const [hoveredEdge, setHoveredEdge] = React.useState<"left" | "right" | null>(
    null,
  );

  const handleBandPointerMove = React.useCallback((e: React.PointerEvent) => {
    if (dragRef.current) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const isLeft = relX < EDGE_HIT_PX;
    const isRight = relX > rect.width - EDGE_HIT_PX;
    setHoveredEdge(isLeft ? "left" : isRight ? "right" : null);
  }, []);

  const handleBandPointerLeave = React.useCallback(() => {
    if (!dragRef.current) setHoveredEdge(null);
  }, []);

  const handleBandPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const bandRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const relX = e.clientX - bandRect.left;
      const isLeftEdge = relX < EDGE_HIT_PX;
      const isRightEdge = relX > bandRect.width - EDGE_HIT_PX;
      const mode: "resize-left" | "resize-right" | "move" = isLeftEdge
        ? "resize-left"
        : isRightEdge
          ? "resize-right"
          : "move";
      const duration = differenceInCalendarDays(range.to, range.from);

      dragRef.current = {
        mode,
        startClientX: e.clientX,
        startFrom: range.from,
        startTo: range.to,
        duration,
      };

      // Update hoveredEdge so inline style cursor reflects drag mode
      setHoveredEdge(
        mode === "resize-left"
          ? "left"
          : mode === "resize-right"
            ? "right"
            : null,
      );

      const onMove = (ev: PointerEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect || !dragRef.current) return;

        if (dragRef.current.mode === "resize-left") {
          const newFrom = xToDate(ev.clientX, rect);
          if (newFrom < dragRef.current.startTo) {
            setRange({
              from: startOfDay(newFrom),
              to: dragRef.current.startTo,
            });
          }
        } else if (dragRef.current.mode === "resize-right") {
          const newTo = xToDate(ev.clientX, rect);
          if (newTo > dragRef.current.startFrom && newTo <= today) {
            setRange({
              from: dragRef.current.startFrom,
              to: startOfDay(newTo),
            });
          }
        } else {
          // Move entire band, preserve duration
          const dx = ev.clientX - dragRef.current.startClientX;
          const pctDelta = dx / rect.width;
          const daysDelta = Math.round(pctDelta * (totalDays - 1));

          let newFrom = new Date(
            dragRef.current.startFrom.getTime() + daysDelta * 86_400_000,
          );
          let newTo = new Date(newFrom.getTime() + duration * 86_400_000);

          // Clamp: don't go past today on the right
          if (newTo > today) {
            newTo = today;
            newFrom = subDays(today, duration);
          }
          // Clamp: don't go past oldest on the left
          if (newFrom < oldest) {
            newFrom = oldest;
            newTo = new Date(oldest.getTime() + duration * 86_400_000);
          }

          setRange({ from: startOfDay(newFrom), to: startOfDay(newTo) });
        }
      };

      const onUp = () => {
        dragRef.current = null;
        setHoveredEdge(null);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [range, xToDate, today, oldest, totalDays, setRange],
  );

  // (startPct and bandWidthPct declared above, before drag handlers)

  const activePreset = React.useMemo(() => {
    const dc = differenceInCalendarDays(range.to, range.from) + 1;
    return (
      presets.find((p) =>
        p.matchByDays ? dc === p.matchByDays : isSameRange(p.getDates(), range),
      )?.label ?? null
    );
  }, [presets, range]);

  const dayCount = differenceInCalendarDays(range.to, range.from) + 1;
  const fromLabel = format(range.from, "MMM d");
  const toLabel = isSameDay(range.to, today)
    ? "Today"
    : format(range.to, "MMM d");

  // A month is bold if it's fully contained in the selected range
  const isMonthFullySelected = React.useCallback(
    (mFrom: Date, mTo: Date) => mFrom >= range.from && mTo <= range.to,
    [range],
  );

  // Month labels positioned at start of each month
  const monthLabels = React.useMemo(() => {
    const result: { label: string; pct: number; from: Date; to: Date }[] = [];
    let i = 0;
    while (i < timelineDays.length) {
      const day = timelineDays[i];
      const month = day.getMonth();
      const year = day.getFullYear();
      let j = i;
      while (
        j < timelineDays.length &&
        timelineDays[j].getMonth() === month &&
        timelineDays[j].getFullYear() === year
      )
        j++;
      const firstDay = timelineDays[i];
      const lastDay = timelineDays[j - 1];
      const midIdx = Math.floor((i + j - 1) / 2);
      result.push({
        label: format(firstDay, "MMMM"),
        pct: (midIdx / (totalDays - 1)) * 100, // center of month
        from: firstDay,
        to: lastDay,
      });
      i = j;
    }
    return result;
  }, [timelineDays, totalDays]);

  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-2xl overflow-hidden",
        className,
      )}
    >
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-5">
        <span className="text-base font-semibold text-gray-900 tabular-nums">
          {fromLabel} – {toLabel}
        </span>
        <Tabs
          value={activePreset ?? ""}
          onValueChange={(v) => {
            const preset = presets.find((p) => p.label === v);
            if (preset) setRange(preset.getDates());
          }}
        >
          <TabsList>
            {presets.map((preset) => (
              <TabsTrigger key={preset.label} value={preset.label}>
                {preset.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="h-px bg-gray-100" />

      {/* ── Timeline area ────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-start gap-4">
          {/* Back chevron — cycles through 0 → +1mo → +2mo → reset */}
          <motion.button
            onClick={handleScrollBack}
            className="flex-shrink-0 h-5 flex items-center leading-none select-none"
            animate={{
              color:
                scrollLevel === 0
                  ? "#9ca3af"
                  : scrollLevel === 1
                    ? "#6b7280"
                    : "#374151",
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            title={
              scrollLevel < 2
                ? "Voir un mois de plus"
                : "Revenir au mois de base"
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={scrollLevel === 2 ? "reset" : "add"}
                initial={{ opacity: 0, y: scrollLevel === 2 ? 4 : -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: scrollLevel === 2 ? -4 : 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="block"
              >
                {scrollLevel === 2 ? "»" : "«"}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Timeline container */}
          <div ref={containerRef} className="relative flex-1 select-none">
            {/* ── Tick marks ─────────────────────────────────────────── */}
            <div className="flex items-end h-5">
              {timelineDays.map((day: Date, i: number) => {
                const isFirst = day.getDate() === 1;
                return (
                  <div key={i} className="flex-1 flex justify-center items-end">
                    <div
                      className={cn(
                        "w-px bg-gray-300",
                        isFirst ? "h-4" : "h-2.5",
                      )}
                    />
                  </div>
                );
              })}
            </div>

            {/* ── Month labels ───────────────────────────────────────── */}
            <div className="relative h-5 mt-2">
              {monthLabels.map(
                ({
                  label,
                  pct,
                  from: mFrom,
                  to: mTo,
                }: {
                  label: string;
                  pct: number;
                  from: Date;
                  to: Date;
                }) => (
                  <button
                    key={`${label}-${pct}`}
                    onClick={() =>
                      setRange({ from: startOfDay(mFrom), to: startOfDay(mTo) })
                    }
                    className={cn(
                      "absolute leading-none text-xs transition-colors",
                      isMonthFullySelected(mFrom, mTo)
                        ? "font-semibold text-gray-700 hover:text-gray-900"
                        : "font-normal text-gray-400 hover:text-gray-500",
                    )}
                    style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
                  >
                    {label}
                  </button>
                ),
              )}
            </div>

            {/* ── Selection band (overlays tick area) ────────────────── */}
            <motion.div
              ref={bandRef}
              className="absolute top-0 h-5 rounded"
              style={{
                left: `${startPct}%`,
                width: `${bandWidthPct}%`,
                background: "rgba(180, 195, 215, 0.22)",
                cursor: hoveredEdge ? "ew-resize" : "grab",
                touchAction: "none",
              }}
              layout
              transition={SPRING}
              onPointerDown={handleBandPointerDown}
              onPointerMove={handleBandPointerMove}
              onPointerLeave={handleBandPointerLeave}
            >
              {/* Left edge handle */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 rounded-full pointer-events-none"
                style={{ minWidth: 2 }}
                animate={{
                  width: hoveredEdge === "left" ? 3 : 2,
                  backgroundColor:
                    hoveredEdge === "left" ? "#6366f1" : "#9ca3af",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              {/* Right edge handle */}
              <motion.div
                className="absolute right-0 top-0 bottom-0 rounded-full pointer-events-none"
                style={{ minWidth: 2 }}
                animate={{
                  width: hoveredEdge === "right" ? 3 : 2,
                  backgroundColor:
                    hoveredEdge === "right" ? "#6366f1" : "#9ca3af",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />

              {/* Day count label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-1 overflow-hidden">
                <div className="overflow-hidden h-[1.2em] flex items-center">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={dayCount}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="text-xs font-medium text-gray-600 tabular-nums block"
                    >
                      {dayCount}
                    </motion.span>
                  </AnimatePresence>
                </div>
                {showDaysWord && (
                  <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                    {dayCount === 1 ? "Day" : "Days"}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
