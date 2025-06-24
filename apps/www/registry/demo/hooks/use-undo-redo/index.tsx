"use client";

import { useUndoRedo } from "@/registry/hooks/use-undo-redo";
import { Button } from "@workspace/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card";
import { Input } from "@workspace/ui/components/ui/input";
import React from "react";

const UndoRedoDemo: React.FC = () => {
  const { state, set, undo, redo, reset, canUndo, canRedo } =
    useUndoRedo<string>({ initialValue: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set(e.target.value);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Undo / Redo Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Input
            value={state}
            onChange={handleChange}
            placeholder="Type something..."
            className="w-full"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={undo}
              disabled={!canUndo}
              type="button"
            >
              Undo
            </Button>
            <Button
              variant="outline"
              onClick={redo}
              disabled={!canRedo}
              type="button"
            >
              Redo
            </Button>
            <Button variant="secondary" onClick={() => reset("")} type="button">
              Reset
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Current value:{" "}
            <span className="font-mono">{state || <em>(empty)</em>}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UndoRedoDemo;
