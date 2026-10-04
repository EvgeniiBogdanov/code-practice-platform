// Функция getArea обрабатывает все виды фигур.
// 1. Сделайте так, чтобы при добавлении нового вида фигуры в тип Shape
//    TypeScript сразу указывал на getArea, если новый вид в ней
//    не обработан.
// 2. Добавьте фигуру "triangle" (base, height) и обработайте её.

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

const getArea = (shape: Shape): number => {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
  }
};
