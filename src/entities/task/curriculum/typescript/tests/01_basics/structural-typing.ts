describe("printPoint", () => {
  test("принимает объект с дополнительными полями", () => {
    printPoint({ x: 1, y: 2, z: 3 });
  });

  test("по-прежнему требует числа в x и y", () => {
    // @ts-expect-error
    printPoint({ x: "1", y: 2 });
    // @ts-expect-error
    printPoint({ x: 1 });
  });
});

describe("saveCelsius", () => {
  test("принимает температуру в Цельсиях", () => {
    saveCelsius(inside);
  });

  test("не принимает температуру в Фаренгейтах", () => {
    // @ts-expect-error
    saveCelsius(outside);
  });
});
