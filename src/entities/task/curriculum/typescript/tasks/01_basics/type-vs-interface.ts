// 1. Опишите модель Shape: фигура может быть кругом (radius)
//    или квадратом (side). Вид фигуры хранится в поле kind.
// 2. «Библиотека» объявляет интерфейс Theme. Добавьте в него поле
//    brandColor, не изменяя исходное объявление.
// 3. Опишите тип ColoredShape — любая фигура с полем color.
//
// Для каждой части выберите type или interface и объясните выбор.
// Примеры допустимых и недопустимых значений — во вкладке tests.ts.

// --- объявление «библиотеки», его менять нельзя ---
interface Theme {
  primaryColor: string;
}
// ---

const theme: Theme = { primaryColor: "black", brandColor: "orange" };

const circle = { kind: "circle", radius: 10 };
const square = { kind: "square", side: 5 };
const coloredCircle = { kind: "circle", radius: 3, color: "red" };
