// hooks/useRenderTimer.ts
import { useRef, useState } from "react";

export function useRenderTimer() {
  const startTime = useRef<number>(0);
  const [renderTime, setRenderTime] = useState<number | null>(null);

  const onRenderStart = () => (startTime.current = performance.now());
  const onRenderEnd = () =>
    setRenderTime(performance.now() - startTime.current);

  return { renderTime, onRenderStart, onRenderEnd };
}
