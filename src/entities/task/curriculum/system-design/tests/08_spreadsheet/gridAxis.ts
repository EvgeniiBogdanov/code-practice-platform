describe("смещения", () => {
  test("одинаковые строки: смещение — индекс × размер", () => {
    const axis = createAxis(1000, 20);
    expect(axis.offsetOf(0)).toBe(0);
    expect(axis.offsetOf(10)).toBe(200);
    expect(axis.offsetOf(1000)).toBe(20000);
  });

  test("изменённая строка сдвигает только строки после неё", () => {
    const axis = createAxis(100, 20);
    axis.setSize(2, 50);
    axis.setSize(5, 10);
    expect(axis.offsetOf(2)).toBe(40);
    expect(axis.offsetOf(3)).toBe(90);
    expect(axis.offsetOf(6)).toBe(140);
    expect(axis.offsetOf(100)).toBe(2020);
  });

  test("повторный setSize заменяет размер", () => {
    const axis = createAxis(10, 20);
    axis.setSize(0, 100);
    axis.setSize(0, 30);
    expect(axis.offsetOf(1)).toBe(30);
    axis.setSize(0, 20);
    expect(axis.offsetOf(10)).toBe(200);
  });
});

describe("строка по смещению", () => {
  test("смещение внутри строки и на границе", () => {
    const axis = createAxis(1000, 20);
    expect(axis.indexAt(0)).toBe(0);
    expect(axis.indexAt(19)).toBe(0);
    expect(axis.indexAt(20)).toBe(1);
    expect(axis.indexAt(205)).toBe(10);
  });

  test("смещения за пределами оси дают первую и последнюю строку", () => {
    const axis = createAxis(1000, 20);
    expect(axis.indexAt(-50)).toBe(0);
    expect(axis.indexAt(1e9)).toBe(999);
  });

  test("строки разной высоты", () => {
    const axis = createAxis(100, 20);
    axis.setSize(2, 50);
    expect(axis.indexAt(45)).toBe(2);
    expect(axis.indexAt(89)).toBe(2);
    expect(axis.indexAt(90)).toBe(3);
    expect(axis.indexAt(110)).toBe(4);
  });
});

describe("видимое окно", () => {
  test("строки, которые видны в окне", () => {
    const axis = createAxis(1000, 20);
    expect(axis.range(100, 200, 0)).toEqual({ start: 5, end: 15 });
    expect(axis.range(110, 200, 0)).toEqual({ start: 5, end: 16 });
  });

  test("запас overscan не выходит за края оси", () => {
    const axis = createAxis(100, 20);
    expect(axis.range(0, 100, 3)).toEqual({ start: 0, end: 8 });
    expect(axis.range(1950, 100, 3)).toEqual({ start: 94, end: 100 });
  });

  test("высокая строка в окне", () => {
    const axis = createAxis(100, 20);
    axis.setSize(3, 400);
    expect(axis.range(70, 100, 0)).toEqual({ start: 3, end: 4 });
  });

  test("миллион строк с изменёнными размерами", () => {
    const axis = createAxis(1_000_000, 24);
    axis.setSize(10, 100);
    axis.setSize(500_000, 240);
    expect(axis.offsetOf(1_000_000)).toBe(24_000_000 + 76 + 216);
    const middle = axis.offsetOf(500_001);
    expect(axis.indexAt(middle - 1)).toBe(500_000);
    expect(axis.indexAt(middle)).toBe(500_001);
    expect(axis.range(middle, 240, 2)).toEqual({ start: 499_999, end: 500_013 });
  });
});
