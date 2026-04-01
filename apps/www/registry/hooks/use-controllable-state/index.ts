import * as React from "react";

interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (next: T) => void;
}

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<T>(defaultValue);

  const currentValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [currentValue, setValue];
}

export default useControllableState;
