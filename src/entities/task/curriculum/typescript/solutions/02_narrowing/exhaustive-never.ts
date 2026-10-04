type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

const assertNever = (value: never): never => {
  throw new Error(`Необработанный вариант: ${JSON.stringify(value)}`);
};

const getArea = (shape: Shape): number => {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      // Если в Shape появится новый вид, shape здесь не будет never
      // и вызов перестанет компилироваться.
      return assertNever(shape);
  }
};

getArea({ kind: "triangle", base: 4, height: 3 }); // 6
