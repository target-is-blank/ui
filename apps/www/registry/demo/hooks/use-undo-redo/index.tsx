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
import { RedoIcon, UndoIcon } from "lucide-react";
import * as React from "react";

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
        <div className="flex flex-col gap-4 w-[300px]">
          <Input
            value={state}
            onChange={handleChange}
            placeholder="Type something..."
            className="w-full"
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={undo}
                disabled={!canUndo}
                type="button"
              >
                <UndoIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={redo}
                disabled={!canRedo}
                type="button"
              >
                <RedoIcon className="size-4" />
              </Button>
            </div>
            <Button
              variant="destructive"
              onClick={() => reset("")}
              type="button"
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UndoRedoDemo;
