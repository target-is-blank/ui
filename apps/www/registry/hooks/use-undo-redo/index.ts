import * as React from "react";

type UseUndoRedoOptions<T> = {
  initialValue: T;
  maxHistory?: number;
};

export function useUndoRedo<T>({
  initialValue,
  maxHistory = 100,
}: UseUndoRedoOptions<T>) {
  const [past, setPast] = React.useState<T[]>([]);
  const [present, setPresent] = React.useState<T>(initialValue);
  const [future, setFuture] = React.useState<T[]>([]);

  const set = React.useCallback(
    (newValue: T) => {
      setPast((prev) => {
        const updated = [...prev, present];
        return updated.length > maxHistory
          ? updated.slice(updated.length - maxHistory)
          : updated;
      });
      setPresent(newValue);
      setFuture([]); // Clear redo history
    },
    [present, maxHistory],
  );

  const undo = React.useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((prev) => prev.slice(0, prev.length - 1));
    setFuture((f) => [present, ...f]);
    setPresent(previous);
  }, [past, present]);

  const redo = React.useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, present]);
    setPresent(next);
  }, [future, present]);

  const reset = React.useCallback((value: T) => {
    setPast([]);
    setFuture([]);
    setPresent(value);
  }, []);

  return {
    state: present,
    set,
    undo,
    redo,
    reset,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
