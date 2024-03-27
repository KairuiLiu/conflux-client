import { useState, useEffect, useRef } from 'react';

export function useElementSize<T extends HTMLElement>(): [
  React.RefObject<T>,
  { width: number; height: number },
] {
  const elementRef = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (elementRef.current) {
        setSize({
          width: elementRef.current.offsetWidth,
          height: elementRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return [elementRef, size];
}
