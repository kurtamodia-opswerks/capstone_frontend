// hooks/useRenderTimer.ts
import { useRef, useState, useCallback } from "react";

export function useRenderTimer() {
  const startTime = useRef<number>(0);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const measured = useRef<boolean>(false);

  const onRenderStart = useCallback(() => {
    measured.current = false;
    startTime.current = performance.now();
  }, []);

  const onRenderEnd = useCallback(async () => {
    if (measured.current) return; // prevent repeated updates
    measured.current = true;

    // Wait for 2 paint frames before marking done
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r(null)))
    );
    setRenderTime(performance.now() - startTime.current);
  }, []);

  return { renderTime, onRenderStart, onRenderEnd };
}
