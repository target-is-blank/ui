import usePersistedState from "@/registry/hooks/use-persisted-state";
import { Button } from "@workspace/ui/components/ui/button";
import { Input } from "@workspace/ui/components/ui/input";

import React from "react";

export default function PersistedStateDemo() {
  const [name, setName, clearName] = usePersistedState(
    "demo:persisted-name",
    "",
  );
  const [count, setCount, clearCount] = usePersistedState(
    "demo:persisted-count",
    0,
  );

  return (
    <div className="flex flex-col gap-4 w-[360px]">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">
          Name (localStorage)
        </span>
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type something and refresh…"
            className="h-8 text-sm"
          />
          <Button size="sm" variant="outline" onClick={clearName}>
            Clear
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-24">
          Count (persisted)
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 text-base"
            onClick={() => setCount((c) => c - 1)}
          >
            −
          </Button>
          <span className="w-10 text-center font-mono text-sm px-2 py-0.5 rounded bg-muted border border-border">
            {count}
          </span>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 text-base"
            onClick={() => setCount((c) => c + 1)}
          >
            +
          </Button>
          <Button size="sm" variant="ghost" onClick={clearCount}>
            Reset
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Values survive page refreshes via localStorage.
      </p>
    </div>
  );
}
