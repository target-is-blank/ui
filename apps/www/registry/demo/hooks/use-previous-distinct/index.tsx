import usePreviousDistinct from "@/registry/hooks/use-previous-distinct";
import { Button } from "@workspace/ui/components/ui/button";

import { useState } from "react";

const COLORS = ["Crimson", "Cobalt", "Emerald", "Amber", "Violet"];

export default function PreviousDistinctDemo() {
  const [index, setIndex] = useState(0);
  const current = COLORS[index];
  const previous = usePreviousDistinct(current);

  function next() {
    setIndex((i) => (i + 1) % COLORS.length);
  }

  function same() {
    setIndex((i) => i); // triggers re-render but same value
  }

  return (
    <div className="flex flex-col gap-5 w-[360px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-24">Current</span>
          <span className="text-sm font-medium px-2 py-0.5 rounded bg-foreground text-background">
            {current}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-24">
            Prev distinct
          </span>
          <span className="text-sm font-medium px-2 py-0.5 rounded bg-muted border border-border">
            {previous ?? "—"}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={next}>
          Next color
        </Button>
        <Button size="sm" variant="outline" onClick={same}>
          Re-render (same)
        </Button>
      </div>
    </div>
  );
}
