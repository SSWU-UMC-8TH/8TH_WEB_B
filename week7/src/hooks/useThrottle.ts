import { useRef, useCallback } from "react";

/**
 * 주어진 delay(ms) 동안 value가 변경되어도 마지막 호출 후 delay가 지나기 전까지는 콜백이 실행되지 않습니다.
 */
export function useThrottle<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const lastCall = useRef(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}