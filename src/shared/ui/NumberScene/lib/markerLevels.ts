// Зазор между соседними подписями одного уровня: иначе «left · 3» и «mid · 4» читаются как одна строка.
const LABEL_GAP = 0.5;

// Подписи с одной стороны плиток, которые пересекаются по горизонтали, получают разные уровни:
// второй уровень стоит выше (или ниже) первого, и текст не накладывается на соседний.
export const assignMarkerLevels = (
  items: readonly { readonly x: number; readonly width: number; readonly below: boolean }[]
): number[] => {
  const levels: number[] = items.map(() => 0);
  [false, true].forEach((side) => {
    const placed: number[] = [];
    items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.below === side)
      .sort((a, b) => a.item.x - b.item.x || a.index - b.index)
      .forEach(({ item, index }) => {
        let level = 0;
        while (
          placed.some(
            (other) =>
              levels[other] === level &&
              Math.abs(items[other].x - item.x) < (items[other].width + item.width) / 2 + LABEL_GAP
          )
        )
          level++;
        levels[index] = level;
        placed.push(index);
      });
  });
  return levels;
};
