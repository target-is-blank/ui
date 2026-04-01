import * as React from "react";

interface UsePersistedStateOptions<T> {
  storage?: "local" | "session";
  serialize?: (value: T) => string;
  deserialize?: (raw: string) => T;
}

function getStorage(type: "local" | "session"): Storage | null {
  if (typeof window === "undefined") return null;
  return type === "session" ? window.sessionStorage : window.localStorage;
}

function usePersistedState<T>(
  key: string,
  defaultValue: T,
  options?: UsePersistedStateOptions<T>,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const storageType = options?.storage ?? "local";
  const serialize = options?.serialize ?? JSON.stringify;
  const deserialize =
    options?.deserialize ?? ((raw: string): T => JSON.parse(raw) as T);

  const readFromStorage = React.useCallback((): T => {
    const store = getStorage(storageType);
    if (!store) return defaultValue;
    try {
      const raw = store.getItem(key);
      if (raw === null) return defaultValue;
      return deserialize(raw);
    } catch {
      return defaultValue;
    }
  }, [key, storageType, defaultValue, deserialize]);

  const [value, setValueState] = React.useState<T>(() => readFromStorage());

  const setValue = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      setValueState((prev) => {
        const resolved =
          typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        try {
          const store = getStorage(storageType);
          store?.setItem(key, serialize(resolved));
        } catch {
          // Silently ignore storage errors (e.g., quota exceeded)
        }
        return resolved;
      });
    },
    [key, storageType, serialize],
  );

  const clear = React.useCallback(() => {
    try {
      const store = getStorage(storageType);
      store?.removeItem(key);
    } catch {
      // Silently ignore
    }
    setValueState(defaultValue);
  }, [key, storageType, defaultValue]);

  // Sync across tabs (localStorage only)
  React.useEffect(() => {
    if (storageType !== "local") return;

    function handleStorage(e: StorageEvent) {
      if (e.key !== key) return;
      if (e.newValue === null) {
        setValueState(defaultValue);
      } else {
        try {
          setValueState(deserialize(e.newValue));
        } catch {
          setValueState(defaultValue);
        }
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, storageType, defaultValue, deserialize]);

  return [value, setValue, clear];
}

export default usePersistedState;
