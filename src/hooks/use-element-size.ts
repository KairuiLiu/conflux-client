import { useState, useEffect, useRef } from 'react';

export function useElementSize<T extends HTMLElement>(
  enable: boolean
): [React.RefObject<T>, { width: number; height: number }] {
  const elementRef = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!enable) return;
    if (elementRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) setSize(entry.contentRect);
      });

      observer.observe(elementRef.current);

      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }
  }, [elementRef, enable]);

  return [elementRef, size];
}
