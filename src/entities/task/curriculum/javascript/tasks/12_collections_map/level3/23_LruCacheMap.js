/** Реализуйте функцию memoize(fn, ms), которая оборачивает переданную функцию fn
 * и кэширует результаты её вызовов на основе аргументов.
 *
 * Требования:
 * - Аргументы функции всегда примитивы (числа, строки и т.д.)
 * - Если функция уже вызывалась с такими же аргументами и с момента вызова
 *   прошло меньше ms миллисекунд — вернуть закэшированный результат,
 *   не вызывая fn повторно
 * - Если кэша нет или он "протух" (прошло больше ms миллисекунд) —
 *   вызвать fn заново, сохранить новый результат и время его истечения
 */
const memoize = (fn, ms) => {
  // Ваш код здесь
};

let callCount = 0;
const slowSquare = (x) => {
  callCount++;
  return x * x;
};

const memoSquare = memoize(slowSquare, 1000);

console.log(memoSquare(5)); // 25, callCount = 1
console.log(memoSquare(5)); // 25, callCount = 1 (взято из кэша)
console.log(callCount);     // 1

setTimeout(() => {
  console.log(memoSquare(5)); // 25, callCount = 2 (кэш устарел)
  console.log(callCount);     // 2
}, 1500);
