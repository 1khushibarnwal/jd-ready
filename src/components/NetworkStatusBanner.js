"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { WifiOff, Wifi } from "lucide-react";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function NetworkStatusBanner() {
  const mounted = useMounted();
  // Lazy initializer (not a setState call inside the effect) so we correctly
  // catch the "already offline when the page loads" case too, not just
  // transitions caught by the online/offline events below.
  const [online, setOnline] = useState(
    () => typeof navigator === "undefined" || navigator.onLine,
  );
  const [showReconnected, setShowReconnected] = useState(false);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    function handleOnline() {
      setOnline(true);
      setShowReconnected(true);
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = setTimeout(
        () => setShowReconnected(false),
        2500,
      );
    }
    function handleOffline() {
      setOnline(false);
      setShowReconnected(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(reconnectTimeout.current);
    };
  }, []);

  // Nothing to show before mount (avoids SSR/CSR mismatch) or while online
  // with no recent reconnect to announce.
  if (!mounted || (online && !showReconnected)) return null;

  return (
    <div
      role="status"
      className={`fixed inset-x-0 top-0 z-[100] flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium text-white ${
        online ? "bg-green-600" : "bg-danger"
      }`}
    >
      {online ? (
        <>
          <Wifi size={15} />
          <span>Back online</span>
        </>
      ) : (
        <>
          <WifiOff size={15} />
          <span>
            You&apos;re offline — check your connection. Changes may not save
            until you&apos;re back online.
          </span>
        </>
      )}
    </div>
  );
}
