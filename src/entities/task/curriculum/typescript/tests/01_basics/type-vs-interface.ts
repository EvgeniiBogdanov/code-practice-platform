describe("Shape", () => {
  test("фигура — круг с radius или квадрат с side", () => {
    const circle: Shape = { kind: "circle", radius: 10 };
    const square: Shape = { kind: "square", side: 5 };
  });

  test("поля круга и квадрата не смешиваются", () => {
    // @ts-expect-error
    const mixed: Shape = { kind: "circle", side: 5 };
    // @ts-expect-error
    const unknownKind: Shape = { kind: "triangle", radius: 1 };
  });
});

test("Theme получает brandColor без изменения исходного объявления", () => {
  const theme: Theme = { primaryColor: "black", brandColor: "orange" };
});

describe("ColoredShape", () => {
  test("любая фигура с полем color", () => {
    const circle: ColoredShape = { kind: "circle", radius: 3, color: "red" };
    const square: ColoredShape = { kind: "square", side: 2, color: "blue" };
  });

  test("без color фигура не подходит", () => {
    // @ts-expect-error
    const plain: ColoredShape = { kind: "circle", radius: 3 };
  });
});
