test("entry — пара «имя, возраст»", () => {
  const pair: [string, number] = entry;
});

test("printEntry принимает пару «имя, возраст»", () => {
  printEntry(["Alice", 30]);
});

test("printEntry не принимает лишние элементы и неверный порядок", () => {
  // @ts-expect-error
  printEntry(["Alice", 30, true]);
  // @ts-expect-error
  printEntry([30, "Alice"]);
});
