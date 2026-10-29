// Лист на миллион строк рисует только то, что видно. Чтобы найти видимые строки, нужно по
// прокрутке узнать, какая строка лежит на этом смещении. Строки бывают разной высоты:
// пользователь растянул некоторые из них. Хранить массив из миллиона смещений и пересчитывать
// его на каждое изменение размера дорого.
//
// Реализуйте createAxis(count, defaultSize) — ось строк (или колонок):
// - setSize(index, size) меняет размер одной строки, остальные остаются defaultSize;
// - offsetOf(index) — смещение начала строки: сумма размеров всех строк до неё;
//   offsetOf(count) — полная длина оси;
// - indexAt(offset) — индекс строки, в которой лежит смещение; смещение ровно на границе
//   принадлежит следующей строке; смещения за пределами оси дают первую или последнюю строку;
// - range(scroll, viewport, overscan) — строки, которые видны в окне [scroll, scroll + viewport),
//   в виде { start, end } (end не входит), плюс overscan строк запаса с каждой стороны,
//   в пределах [0, count);
// - на миллионе строк методы не должны перебирать все строки: храните только изменённые
//   размеры, а строку по смещению ищите двоичным поиском.

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
  // Все строки считаются одинаковыми.
  return {
    setSize: () => {},
    offsetOf: (index) => index * defaultSize,
    indexAt: (offset) => Math.floor(offset / defaultSize),
    range: (scroll, viewport) => ({
      start: Math.floor(scroll / defaultSize),
      end: Math.ceil((scroll + viewport) / defaultSize),
    }),
  };
}
