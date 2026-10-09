test("getArea принимает круг и квадрат", () => {
  const circle: number = getArea({ kind: "circle", radius: 2 });
  const square: number = getArea({ kind: "square", side: 3 });
});

test("треугольник — допустимая фигура", () => {
  const triangle: number = getArea({ kind: "triangle", base: 4, height: 3 });
});

test("неизвестная фигура отклоняется", () => {
  // @ts-expect-error
  getArea({ kind: "hexagon", side: 1 });
  // @ts-expect-error
  getArea({ kind: "triangle", base: 4 });
});
