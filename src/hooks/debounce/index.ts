import { debounce } from "@/lib/utils";
import React, { useState, useEffect } from "react";
// export function useDebounce<T extends (...args: unknown[]) => unknown>(
//   func: T,
//   wait: number
// ): (...args: Parameters<T>) => void {
//   return debounce(func, wait);
// }

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
