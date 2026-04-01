import * as React from "react";

interface UsePreviousDistinctOptions<T> {
  isEqual?: (a: T, b: T) => boolean;
}

function defaultIsEqual<T>(a: T, b: T): boolean {
  return a === b;
}

function usePreviousDistinct<T>(
  value: T,
  options?: UsePreviousDistinctOptions<T>,
): T | undefined {
  const isEqual = options?.isEqual ?? defaultIsEqual;
  const previousRef = React.useRef<T | undefined>(undefined);
  const currentRef = React.useRef<T>(value);

  if (!isEqual(currentRef.current, value)) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
}

export default usePreviousDistinct;
