import { useState, useEffect, useRef } from 'react';

interface Size {
  width: number;
  height: number;
}

interface SizeWithLayout extends Size {
  col: number;
  row: number;
}

export const aspRange = [1.25, 1.8];
const MAX_LINE = 6;
const MAX_COLUMN = 6;
const MAX_ITEM_IN_PAGE = 9;

function calculateSize({ width, height }: Size, count: number): SizeWithLayout {
  if (count === 0) return { width: 0, height: 0, col: 0, row: 0 };
  const itemsInPage = Math.min(count, MAX_ITEM_IN_PAGE);
  let res: SizeWithLayout = { width: 0, height: 0, col: 0, row: 0 };
  let currentSize = 0;

  for (let line = 1; line <= MAX_LINE; line++) {
    for (let column = 1; column <= MAX_COLUMN; column++) {
      if (
        line * column < itemsInPage ||
        line * column - Math.max(line, column) >= itemsInPage
      )
        continue;
      const itemMaxWidth = width / column;
      const itemMaxHeight = height / line;
      const asp = itemMaxWidth / itemMaxHeight;
      if (asp >= aspRange[0] && asp <= aspRange[1]) {
        const totalSize = itemMaxWidth * itemMaxHeight * itemsInPage;
        if (totalSize > currentSize) {
          res = {
            width: itemMaxWidth,
            height: itemMaxHeight,
            col: column,
            row: line,
          };
          currentSize = totalSize;
        }
      } else if (asp < aspRange[0]) {
        const totalSize =
          ((itemMaxWidth * itemMaxWidth) / aspRange[0]) * itemsInPage;
        if (totalSize > currentSize) {
          res = {
            width: itemMaxWidth,
            height: itemMaxWidth / aspRange[0],
            col: column,
            row: line,
          };
          currentSize = totalSize;
        }
      } else if (asp > aspRange[1]) {
        const totalSize =
          itemMaxHeight * itemMaxHeight * aspRange[1] * itemsInPage;
        if (totalSize > currentSize) {
          res = {
            width: itemMaxHeight * aspRange[1],
            height: itemMaxHeight,
            col: column,
            row: line,
          };
          currentSize = totalSize;
        }
      }
    }
  }

  return res;
}

function calcListSize({ width, height }: Size): Size {
  const asp = width / height;
  if (asp >= aspRange[0] && asp <= aspRange[1]) {
    return { width: width, height: height };
  } else if (asp < aspRange[0]) {
    return { width: width, height: width / aspRange[0] };
  } else {
    return { width: height * aspRange[1], height: height };
  }
}

export function useVideoPanelSize<T extends HTMLElement>(
  itemCount: number
): [React.RefObject<T>, SizeWithLayout, Size] {
  const panelRef = useRef<T>(null);
  const [videoPanelGridSize, setVideoPanelGridSize] = useState<SizeWithLayout>({
    width: 0,
    height: 0,
    col: 0,
    row: 0,
  });
  const [videoPanelMainSize, setVideoPanelMainSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setVideoPanelGridSize(calculateSize(containerSize, itemCount));
    setVideoPanelMainSize(
      calcListSize({
        width: ((containerSize.width - 48) / 7) * 6,
        height: ((containerSize.height - 48) / 7) * 6,
      })
    );
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

  return [panelRef, videoPanelGridSize, videoPanelMainSize];
}

// function calculateSize({ width, height }: Size, count: number): Size {
//   if (count === 0) return { width: 0, height: 0 };
//   const itemsInPage = Math.min(count, MAX_LINE * MAX_COLUMN);
//   let res: Size = { width: 0, height: 0 };
//   let currentSize = 0;

//   for (let line = 1; line <= MAX_LINE; line++) {
//     for (let column = 1; column <= MAX_COLUMN; column++) {
//       if (line * column < itemsInPage) continue;
//       const itemMaxWidth = width / column;
//       const itemMaxHeight = height / line;

//       // limit size by width
//       {
//         const itemWidth = itemMaxWidth;
//         const heightRange = [itemWidth / aspRange[1], itemWidth / aspRange[0]];
//         if (itemMaxHeight >= heightRange[0]) {
//           const itemHeight = Math.min(heightRange[1], itemMaxHeight);
//           const totalSize = itemHeight * itemWidth * itemsInPage;
//           if (totalSize > currentSize) {
//             res = { width: itemWidth, height: itemHeight };
//             currentSize = totalSize;
//           }
//         }
//       }

//       // limit size by width
//       {
//         const itemHeight = itemMaxHeight;
//         const widthRange = [itemHeight * aspRange[0], itemHeight * aspRange[1]];
//         if (itemMaxWidth >= widthRange[0]) {
//           const itemWidth = Math.min(widthRange[1], itemMaxWidth);
//           const totalSize = itemHeight * itemWidth * itemsInPage;
//           if (totalSize > currentSize) {
//             res = { width: itemWidth, height: itemHeight };
//             currentSize = totalSize;
//           }
//         }
//       }
//     }
//   }

//   return res;
// }
