interface OrangeScanInput {
  readonly grid: readonly (readonly number[])[];
  readonly add: (line: string, title: string, explanation: string) => void;
  readonly enqueue: (id: number) => void;
  readonly setActive: (id: number) => void;
  readonly setFresh: (count: number) => void;
}

export const scanOrangeSources = ({
  grid,
  add,
  enqueue,
  setActive,
  setFresh,
}: OrangeScanInput): void => {
  const width = grid[0]?.length ?? 0;
  let fresh = 0;
  grid.forEach((row, r) => {
    add("for (let r = 0; r < rows; r += 1)", "Следующая строка", `Сканируем строку ${r}.`);
    row.forEach((value, c) => {
      const id = r * width + c;
      setActive(id);
      add("for (let c = 0; c < cols; c += 1)", "Следующая ячейка", `Проверяем [${r}, ${c}].`);
      add(
        "if (grid[r][c] === 2)",
        "Ищем источник гниения",
        value === 2 ? "Гнилой апельсин станет стартом BFS." : "Эта ячейка не запускает гниение."
      );
      if (value === 2) {
        enqueue(id);
        add("queue.push([r, c])", "Добавляем источник", `Ячейка [${r}, ${c}] в очереди.`);
      }
      add(
        "if (grid[r][c] === 1)",
        "Проверяем свежесть",
        value === 1
          ? "Свежий апельсин должен быть достигнут волной."
          : "Свежего апельсина здесь нет."
      );
      if (value === 1) {
        fresh++;
        setFresh(fresh);
        add("freshCount += 1", "Считаем свежий апельсин", `Осталось свежих: ${fresh}.`);
      }
    });
  });
};
