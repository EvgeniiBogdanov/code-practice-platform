const sum = (values) => values.reduce((total, value) => total + value, 0);

describe("формулы", () => {
  test("формула считается сразу и читает значения ячеек", () => {
    const sheet = createSheet();
    sheet.setValue("A1", 2);
    sheet.setValue("B1", 3);
    expect(sheet.setFormula("C1", ["A1", "B1"], sum)).toEqual(["C1"]);
    expect(sheet.get("C1")).toBe(5);
  });

  test("пустая ячейка даёт 0, неизвестная — undefined", () => {
    const sheet = createSheet();
    sheet.setFormula("A1", ["Z9"], ([z]) => z + 1);
    expect(sheet.get("A1")).toBe(1);
    expect(sheet.get("Q7")).toBe(undefined);
  });
});

describe("пересчёт", () => {
  test("изменение пересчитывает цепочку по порядку", () => {
    const sheet = createSheet();
    sheet.setValue("A1", 1);
    sheet.setFormula("B1", ["A1"], ([a]) => a * 2);
    sheet.setFormula("C1", ["B1"], ([b]) => b + 1);
    expect(sheet.setValue("A1", 5)).toEqual(["B1", "C1"]);
    expect(sheet.get("C1")).toBe(11);
  });

  test("ромб: каждая формула один раз и после всех зависимостей", () => {
    const sheet = createSheet();
    let d1Calls = 0;
    sheet.setValue("A1", 1);
    sheet.setFormula("B1", ["A1"], ([a]) => a + 1);
    sheet.setFormula("C1", ["A1"], ([a]) => a * 10);
    sheet.setFormula("D1", ["B1", "C1"], ([b, c]) => {
      d1Calls++;
      return b + c;
    });
    d1Calls = 0;
    const order = sheet.setValue("A1", 2);
    expect(d1Calls).toBe(1);
    expect(order.length).toBe(3);
    expect(order[2]).toBe("D1");
    expect(sheet.get("D1")).toBe(23);
  });

  test("формулы, которые от изменения не зависят, не пересчитываются", () => {
    const sheet = createSheet();
    let otherCalls = 0;
    sheet.setFormula("B1", ["A1"], ([a]) => a);
    sheet.setFormula("E1", ["Z1"], ([z]) => {
      otherCalls++;
      return z;
    });
    otherCalls = 0;
    expect(sheet.setValue("A1", 7)).toEqual(["B1"]);
    expect(otherCalls).toBe(0);
  });

  test("новая формула заменяет прежние зависимости", () => {
    const sheet = createSheet();
    sheet.setFormula("B1", ["A1"], ([a]) => a * 2);
    sheet.setFormula("B1", ["C1"], ([c]) => c + 100);
    expect(sheet.setValue("A1", 5)).toEqual([]);
    expect(sheet.setValue("C1", 1)).toEqual(["B1"]);
    expect(sheet.get("B1")).toBe(101);
  });
});

describe("циклы", () => {
  test("цикл даёт #CYCLE, а не зависание", () => {
    const sheet = createSheet();
    sheet.setFormula("A1", ["B1"], ([b]) => b + 1);
    expect(sheet.setFormula("B1", ["A1"], ([a]) => a + 1)).toEqual([]);
    expect(sheet.get("A1")).toBe("#CYCLE");
    expect(sheet.get("B1")).toBe("#CYCLE");
  });

  test("ссылка на саму себя — тоже цикл", () => {
    const sheet = createSheet();
    sheet.setFormula("A1", ["A1"], ([a]) => a + 1);
    expect(sheet.get("A1")).toBe("#CYCLE");
  });

  test("ошибка цикла передаётся зависимым формулам", () => {
    const sheet = createSheet();
    sheet.setFormula("C1", ["A1"], ([a]) => a * 2);
    sheet.setFormula("A1", ["B1"], ([b]) => b + 1);
    sheet.setFormula("B1", ["A1"], ([a]) => a + 1);
    expect(sheet.get("C1")).toBe("#CYCLE");
    sheet.setFormula("D1", ["C1"], ([c]) => c + 1);
    expect(sheet.get("D1")).toBe("#CYCLE");
  });

  test("число вместо формулы разрывает цикл", () => {
    const sheet = createSheet();
    sheet.setFormula("A1", ["B1"], ([b]) => b + 1);
    sheet.setFormula("B1", ["A1"], ([a]) => a + 1);
    expect(sheet.setValue("B1", 10)).toEqual(["A1"]);
    expect(sheet.get("A1")).toBe(11);
    expect(sheet.get("B1")).toBe(10);
  });
});
