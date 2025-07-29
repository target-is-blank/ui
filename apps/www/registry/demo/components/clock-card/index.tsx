import { ClockCard } from "@/registry/components/clock-card";
import { CalendarClock, LayoutList } from "lucide-react";

export const ClockCardDemo = () => {
  return (
    <ClockCard format="12h">
      <div className="flex flex-wrap items-center justify-center p-3 font-medium max-w-2xs">
        <span className="text-neutral-400 mr-1">You have</span>
        <span className="flex items-center gap-1 mr-1">
          2 meetings <CalendarClock className="size-4" />
        </span>
        <span className="text-neutral-400">and</span>
        <span className="flex items-center gap-1 mr-1">
          4 tasks <LayoutList className="size-4" />
        </span>
        <span className="text-neutral-400">to complete today</span>
      </div>
    </ClockCard>
  );
};
