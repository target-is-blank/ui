import * as React from "react";

function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = React.useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  const handleOnline = React.useCallback(() => setIsOnline(true), []);
  const handleOffline = React.useCallback(() => setIsOnline(false), []);

  React.useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOffline, handleOnline]);

  return isOnline;
}

export default useOnlineStatus;
