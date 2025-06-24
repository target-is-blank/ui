import useDebounce from "@/registry/hooks/use-debounce";
import { Input } from "@workspace/ui/components/ui/input";
import React, { useState } from "react";

export default function DebounceDemo() {
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const debouncedUpdate = useDebounce((val: string) => {
    setDebouncedValue(val);
  }, 500);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    debouncedUpdate(e.target.value);
  }

  return (
    <div className="flex flex-col gap-4 w-[400px]">
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Your entry will be debounced after 300ms"
      />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Instant value :</span>
          <span className="text-sm">{value}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Debounced value :
          </span>
          <span className="text-sm">{debouncedValue}</span>
        </div>
      </div>
    </div>
  );
}
