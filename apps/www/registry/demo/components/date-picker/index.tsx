"use client";

import { DatePickerInput } from "@/registry/components/date-picker";
import React from "react";

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <DatePickerInput
        value={date}
        onChange={setDate}
        placeholder="Pick a date"
      />
    </div>
  );
}
