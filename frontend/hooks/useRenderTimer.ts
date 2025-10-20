// hooks/useRenderTimer.ts
import { useRef, useState } from "react";

export function useRenderTimer() {
  const startTime = useRef<number>(0);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [paintTime, setPaintTime] = useState<number | null>(null);

  const onRenderStart = () => (startTime.current = performance.now());
  const onRenderEnd = () => setPaintTime(performance.now() - startTime.current);

  return { renderTime, paintTime, setRenderTime, onRenderStart, onRenderEnd };
}
