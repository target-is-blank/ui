"use client";

import { useScrollPosition } from "@/registry/hooks/use-scroll-position";
import { Button } from "@workspace/ui/components/ui/button";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "lucide-react";
import * as React from "react";

const ScrollPositionDemo: React.FC = () => {
  const { x, y, direction } = useScrollPosition({ throttleDelay: 50 });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const scrollToLeft = () => {
    window.scrollTo({ left: 0, behavior: "smooth" });
  };

  const scrollToRight = () => {
    window.scrollTo({ left: document.body.scrollWidth, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{x}</div>
          <div className="text-sm text-muted-foreground">X Position</div>
          {direction.horizontal && (
            <div className="flex items-center justify-center mt-1">
              {direction.horizontal === "left" ? (
                <ArrowLeftIcon className="size-4 text-blue-500" />
              ) : (
                <ArrowRightIcon className="size-4 text-blue-500" />
              )}
            </div>
          )}
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{y}</div>
          <div className="text-sm text-muted-foreground">Y Position</div>
          {direction.vertical && (
            <div className="flex items-center justify-center mt-1">
              {direction.vertical === "up" ? (
                <ArrowUpIcon className="size-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="size-4 text-green-500" />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={scrollToTop} variant="outline" size="sm">
          Scroll to Top
        </Button>
        <Button onClick={scrollToBottom} variant="outline" size="sm">
          Scroll to Bottom
        </Button>
        <Button onClick={scrollToLeft} variant="outline" size="sm">
          Scroll to Left
        </Button>
        <Button onClick={scrollToRight} variant="outline" size="sm">
          Scroll to Right
        </Button>
      </div>
    </div>
  );
};

export default ScrollPositionDemo;
