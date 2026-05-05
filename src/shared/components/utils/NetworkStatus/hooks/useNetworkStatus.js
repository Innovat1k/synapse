import { useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { isOnlineAtom } from "@atoms/networkAtom";

// Tracks browser online/offline status with real-time updates via window events
export const useNetworkStatus = () => {
  const setIsOnline = useSetAtom(isOnlineAtom);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    // deterministic handlers (no navigator read on events)
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline]);
};

export const useIsOnline = () => {
  const isOnline = useAtomValue(isOnlineAtom);
  return isOnline;
};
