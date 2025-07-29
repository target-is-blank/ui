"use client";

import { DateRangeTimeline } from "@/registry/components/date-range-timeline";
import { startOfMonth } from "date-fns";
import React from "react";

export default function DateRangeTimelineDemo() {
  const [range, setRange] = React.useState({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <div className="flex items-center justify-center p-8 w-full">
      <DateRangeTimeline
        value={range}
        onChange={setRange}
        className="w-full max-w-2xl"
      />
    </div>
  );
}
