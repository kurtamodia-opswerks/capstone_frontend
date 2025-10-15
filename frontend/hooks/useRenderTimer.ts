// hooks/useRenderTimer.ts
import { useRef, useState } from "react";

export function useRenderTimer() {
  const startTime = useRef<number>(0);
  const [renderTime, setRenderTime] = useState<number | null>(null);

  // Called before React starts rendering the chart
  const onRenderStart = () => {
    startTime.current = performance.now();
  };

  // Called after the browser paints the rendered chart
  const onRenderEnd = () => {
    requestAnimationFrame(() => {
      const endTime = performance.now();
      setRenderTime(endTime - startTime.current);
    });
  };

  return { renderTime, onRenderStart, onRenderEnd };
}
