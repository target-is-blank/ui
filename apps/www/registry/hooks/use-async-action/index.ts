import * as React from "react";

type AsyncStatus = "idle" | "loading" | "success" | "error";

interface UseAsyncActionOptions<TData> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: TData | undefined, error: Error | undefined) => void;
  preventConcurrent?: boolean;
}

interface UseAsyncActionReturn<TData, TArgs extends unknown[]> {
  execute: (...args: TArgs) => Promise<void>;
  status: AsyncStatus;
  data: TData | undefined;
  error: Error | undefined;
  reset: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

function useAsyncAction<TData, TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<TData>,
  options?: UseAsyncActionOptions<TData>,
): UseAsyncActionReturn<TData, TArgs> {
  const [status, setStatus] = React.useState<AsyncStatus>("idle");
  const [data, setData] = React.useState<TData | undefined>(undefined);
  const [error, setError] = React.useState<Error | undefined>(undefined);
  const optionsRef = React.useRef(options);
  optionsRef.current = options;

  const execute = React.useCallback(
    async (...args: TArgs) => {
      if (optionsRef.current?.preventConcurrent && status === "loading") {
        return;
      }

      setStatus("loading");
      setError(undefined);

      try {
        const result = await fn(...args);
        setData(result);
        setStatus("success");
        optionsRef.current?.onSuccess?.(result);
        optionsRef.current?.onSettled?.(result, undefined);
      } catch (err) {
        const normalized = err instanceof Error ? err : new Error(String(err));
        setError(normalized);
        setStatus("error");
        optionsRef.current?.onError?.(normalized);
        optionsRef.current?.onSettled?.(undefined, normalized);
      }
    },
    [fn, status],
  );

  const reset = React.useCallback(() => {
    setStatus("idle");
    setData(undefined);
    setError(undefined);
  }, []);

  return {
    execute,
    status,
    data,
    error,
    reset,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
  };
}

export default useAsyncAction;
