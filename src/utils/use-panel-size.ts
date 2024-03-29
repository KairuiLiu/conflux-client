import { useState, useEffect, useRef } from 'react';

interface Size {
  width: number;
  height: number;
}

export const aspRange = [1.25, 1.8];
const MAX_LINE = 3;
const MAX_COLUMN = 3;

function calculateSize({ width, height }: Size, count: number): Size {
  if (count === 0) return { width: 0, height: 0 };
  const itemsInPage = Math.min(count, MAX_LINE * MAX_COLUMN);
  let res: Size = { width: 0, height: 0 };
  let currentSize = 0;

  for (let line = 1; line <= MAX_LINE; line++) {
    for (let column = 1; column <= MAX_COLUMN; column++) {
      if (line * column < itemsInPage) continue;
      const itemMaxWidth = width / column;
      const itemMaxHeight = height / line;

      // limit size by width
      {
        const itemWidth = itemMaxWidth;
        const heightRange = [itemWidth / aspRange[1], itemWidth / aspRange[0]];
        if (itemMaxHeight >= heightRange[0]) {
          const itemHeight = Math.min(heightRange[1], itemMaxHeight);
          const totalSize = itemHeight * itemWidth * itemsInPage;
          if (totalSize > currentSize) {
            res = { width: itemWidth, height: itemHeight };
            currentSize = totalSize;
          }
        }
      }

      // limit size by width
      {
        const itemHeight = itemMaxHeight;
        const widthRange = [itemHeight * aspRange[0], itemHeight * aspRange[1]];
        if (itemMaxWidth >= widthRange[0]) {
          const itemWidth = Math.min(widthRange[1], itemMaxWidth);
          const totalSize = itemHeight * itemWidth * itemsInPage;
          if (totalSize > currentSize) {
            res = { width: itemWidth, height: itemHeight };
            currentSize = totalSize;
          }
        }
      }
    }
  }

  return res;
}

export function useVideoPanelSize<T extends HTMLElement>(
  count: number
): [React.RefObject<T>, Size, React.Dispatch<React.SetStateAction<number>>] {
  const panelRef = useRef<T>(null);
  const [videoPanelSize, setVideoPanelSize] = useState({ width: 0, height: 0 });
  const [itemCount, setItemCount] = useState(count);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setVideoPanelSize(calculateSize(containerSize, itemCount));
  }, [containerSize, itemCount]);

  useEffect(() => {
    if (panelRef.current) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerSize(entry.contentRect);
        }
      });

      observer.observe(panelRef.current);

      return () => {
        if (panelRef.current) {
          observer.unobserve(panelRef.current);
        }
      };
    }
  }, [panelRef]);

  return [panelRef, videoPanelSize, setItemCount];
}
