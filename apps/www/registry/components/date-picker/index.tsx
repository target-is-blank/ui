"use client";

import { cn } from "@workspace/ui/lib/utils";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Popover } from "radix-ui";
import * as React from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
};

type DatePickerInputProps = DatePickerProps & {
  placeholder?: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCalendarDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start, end });
  // Always return exactly 42 days (6 weeks)
  while (days.length < 42) {
    const last = days[days.length - 1];
    days.push(new Date(last.getTime() + 86400000));
  }
  return days.slice(0, 42);
}

// ─── DatePicker ──────────────────────────────────────────────────────────────

function DatePicker({ value, onChange, className }: DatePickerProps) {
  const today = React.useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(value ?? today);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [monthKey, setMonthKey] = React.useState(
    format(value ?? today, "yyyy-MM"),
  );

  const days = React.useMemo(
    () => getCalendarDays(currentMonth),
    [currentMonth],
  );

  const navigate = React.useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      const next =
        dir === 1 ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1);
      setCurrentMonth(next);
      setMonthKey(format(next, "yyyy-MM"));
    },
    [currentMonth],
  );

  const goToToday = React.useCallback(() => {
    const todayStart = startOfMonth(today);
    const currentStart = startOfMonth(currentMonth);
    const dir = todayStart >= currentStart ? 1 : -1;
    setDirection(dir);
    setCurrentMonth(today);
    setMonthKey(format(today, "yyyy-MM"));
  }, [today, currentMonth]);

  const slideVariants = {
    enter: (d: number) => ({
      x: d * 40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d * -40,
      opacity: 0,
    }),
  };

  return (
    <div
      className={cn(
        "w-72 rounded-2xl border border-border bg-background p-4 shadow-lg",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={SPRING}
          onClick={() => navigate(-1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>

        <div className="relative h-6 flex-1 overflow-hidden">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={monthKey}
              custom={direction}
              variants={{
                enter: (d: number) => ({ y: d * 10, opacity: 0 }),
                center: { y: 0, opacity: 1 },
                exit: (d: number) => ({ y: d * -10, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ ...SPRING, duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-foreground"
            >
              {format(currentMonth, "MMMM yyyy")}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={SPRING}
          onClick={() => navigate(1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Weekday labels */}
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="flex h-7 items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={monthKey}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SPRING}
            className="grid grid-cols-7"
          >
            {days.map((day, i) => {
              const isSelected = value ? isSameDay(day, value) : false;
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDay = isToday(day);

              return (
                <motion.button
                  key={`${format(day, "yyyy-MM-dd")}-${i}`}
                  onClick={() => onChange?.(day)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={SPRING}
                  className={cn(
                    "relative flex h-8 w-full flex-col items-center justify-center rounded-full text-sm",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isCurrentMonth
                      ? "text-foreground"
                      : "text-muted-foreground/40",
                    !isSelected &&
                      isCurrentMonth &&
                      "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {/* Selected day highlight */}
                  {isSelected && (
                    <motion.span
                      layoutId="selected-day"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={SPRING}
                    />
                  )}

                  {/* Day number */}
                  <span
                    className={cn(
                      "relative z-10 text-xs font-medium leading-none",
                      isSelected && "text-background",
                    )}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Today dot */}
                  {isTodayDay && (
                    <span
                      className={cn(
                        "relative z-10 mt-0.5 h-1 w-1 rounded-full",
                        isSelected ? "bg-background/70" : "bg-foreground/40",
                      )}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-3 flex justify-center border-t border-border pt-3">
        <motion.button
          onClick={goToToday}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={SPRING}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Go to today
        </motion.button>
      </div>
    </div>
  );
}

// ─── DatePickerInput ─────────────────────────────────────────────────────────

function DatePickerInput({
  value,
  onChange,
  className,
  placeholder = "Pick a date",
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (date: Date) => {
      onChange?.(date);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={SPRING}
          className={cn(
            "flex h-9 min-w-[200px] items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm",
            "text-left font-normal shadow-sm hover:bg-accent hover:text-accent-foreground",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 opacity-50" />
          <span>{value ? format(value, "PPP") : placeholder}</span>
        </motion.button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 outline-none"
          asChild
        >
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={SPRING}
          >
            <DatePicker value={value} onChange={handleSelect} />
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export { DatePicker, DatePickerInput };
export type { DatePickerProps, DatePickerInputProps };
