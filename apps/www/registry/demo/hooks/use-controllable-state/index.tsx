import useControllableState from "@/registry/hooks/use-controllable-state";
import { Button } from "@workspace/ui/components/ui/button";

import React, { useState } from "react";

const OPTIONS = ["Draft", "Review", "Published"];

function StatusSelector({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [status, setStatus] = useControllableState({
    value,
    defaultValue: "Draft",
    onChange,
  });

  return (
    <div className="flex gap-2">
      {OPTIONS.map((opt) => (
        <Button
          key={opt}
          size="sm"
          variant={status === opt ? "default" : "outline"}
          onClick={() => setStatus(opt)}
        >
          {opt}
        </Button>
      ))}
    </div>
  );
}

export default function ControllableStateDemo() {
  const [controlled, setControlled] = useState<string>("Review");
  const [log, setLog] = useState<string[]>([]);

  function handleChange(v: string) {
    setLog((prev) => [`onChange("${v}")`, ...prev].slice(0, 3));
  }

  return (
    <div className="flex flex-col gap-5 w-[360px]">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Uncontrolled</span>
        <StatusSelector onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">
          Controlled — locked to &quot;{controlled}&quot;
        </span>
        <div className="flex gap-2 items-center">
          <StatusSelector value={controlled} onChange={handleChange} />
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setControlled(
                OPTIONS[(OPTIONS.indexOf(controlled) + 1) % OPTIONS.length],
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
      <div className="flex gap-1 flex-wrap min-h-[24px]">
        {log.map((entry, i) => (
          <span
            key={i}
            className="font-mono text-xs px-2 py-0.5 rounded border border-border bg-muted"
          >
            {entry}
          </span>
        ))}
      </div>
    </div>
  );
}
