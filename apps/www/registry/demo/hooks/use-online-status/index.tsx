"use client";

import React from "react";
// On suppose que le hook est importable ainsi, sinon ajuster le chemin :
import useOnlineStatus from "@/registry/hooks/use-online-status";
import { cn } from "@workspace/ui/lib/utils";

const OnlineStatusDemo: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "size-1.5 rounded-full",
          isOnline ? "bg-green-400" : "bg-red-400",
        )}
      />
      <span className="text-sm text-muted-foreground">Connection status :</span>
      <span
        className={cn(
          "text-sm font-medium",
          isOnline ? "text-green-500" : "text-red-500",
        )}
      >
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
};

export default OnlineStatusDemo;
