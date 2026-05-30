import { useState, useEffect, useRef, useCallback } from "react";
import type { MouseEvent, TouchEvent } from "react";

interface UseHoldToRevealProps {
  duration?: number; // Duration in ms, defaults to 1500
  onRevealComplete: () => void;
}

export function useHoldToReveal({ duration = 1500, onRevealComplete }: UseHoldToRevealProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    // Clear interval/timeout
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsHolding(false);
    setProgress(0);
  }, []);

  const handleStart = useCallback(() => {
    reset();
    setIsHolding(true);
    startTimeRef.current = Date.now();

    // Trigger completion after the duration
    timerRef.current = window.setTimeout(() => {
      onRevealComplete();
      reset();
    }, duration);

    // Smooth progress updates using requestAnimationFrame
    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(elapsed / duration, 1);
      setProgress(currentProgress);

      if (elapsed < duration) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };
    animationFrameRef.current = requestAnimationFrame(updateProgress);
  }, [duration, onRevealComplete, reset]);

  // Handle release (cleanup and fail if not completed)
  const handleRelease = useCallback(() => {
    reset();
  }, [reset]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Return standard mouse and touch handlers to be spread on a component
  const holdHandlers = {
    onMouseDown: (e: MouseEvent) => {
      if (e.button !== 0) return; // Only trigger on left-click
      e.preventDefault();
      handleStart();
    },
    onMouseUp: handleRelease,
    onMouseLeave: handleRelease,
    onTouchStart: (e: TouchEvent) => {
      // Touch devices can scroll, prevent default behavior if inside holding area
      if (e.cancelable) {
        e.preventDefault();
      }
      handleStart();
    },
    onTouchEnd: handleRelease,
    onTouchCancel: handleRelease,
  };

  return {
    isHolding,
    progress,
    holdHandlers,
    reset,
  };
}
