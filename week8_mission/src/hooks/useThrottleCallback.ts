import { useRef, useCallback } from "react";

export function useThrottleCallback(callback: () => void, delay: number) {
  const lastCalled = useRef(0);

  return useCallback(() => {
    const now = Date.now();
    if (now - lastCalled.current >= delay) {
      callback();
      lastCalled.current = now;
    }
  }, [callback, delay]);
}
