// --- объявление «библиотеки», его менять нельзя ---
interface Theme {
  primaryColor: string;
}
// ---

// Слияние объявлений: поля обоих интерфейсов Theme объединяются.
interface Theme {
  brandColor: string;
}

interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  side: number;
}

// Объединение можно описать только через type.
type Shape = Circle | Square;

// Пересечение добавляет поле к каждому варианту объединения.
type ColoredShape = Shape & { color: string };

const theme: Theme = { primaryColor: "black", brandColor: "orange" };

const circle: Shape = { kind: "circle", radius: 10 };
const square: Shape = { kind: "square", side: 5 };
const coloredCircle: ColoredShape = { kind: "circle", radius: 3, color: "red" };
