export interface AxisRange {
  start: number;
  end: number;
}

export interface Axis {
  setSize: (index: number, size: number) => void;
  offsetOf: (index: number) => number;
  indexAt: (offset: number) => number;
  range: (scroll: number, viewport: number, overscan: number) => AxisRange;
}

export function createAxis(count: number, defaultSize: number): Axis {
  // Только строки, размер которых отличается от размера по умолчанию.
  const sizes = new Map<number, number>();

  const setSize = (index: number, size: number): void => {
    if (size === defaultSize) sizes.delete(index);
    else sizes.set(index, size);
  };

  /** O(число изменённых строк), а не O(index). */
  const offsetOf = (index: number): number => {
    let offset = index * defaultSize;
    for (const [row, size] of sizes) if (row < index) offset += size - defaultSize;
    return offset;
  };

  /** Последняя строка, которая начинается не позже offset: двоичный поиск по смещениям. */
  const indexAt = (offset: number): number => {
    let low = 0;
    let high = count - 1;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      if (offsetOf(mid) <= offset) low = mid;
      else high = mid - 1;
    }
    return low;
  };

  const range = (scroll: number, viewport: number, overscan: number): AxisRange => {
    const bottom = scroll + viewport;
    const last = indexAt(bottom);
    // Строка, которая начинается ровно на нижней границе, уже не видна.
    const end = offsetOf(last) < bottom ? last + 1 : last;
    return {
      start: Math.max(0, indexAt(scroll) - overscan),
      end: Math.min(count, end + overscan),
    };
  };

  return { setSize, offsetOf, indexAt, range };
}
