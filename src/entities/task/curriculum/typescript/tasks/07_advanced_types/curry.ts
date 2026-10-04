// Функция curry превращает функцию от нескольких аргументов
// в цепочку функций от одного аргумента:
//
// const format = curry((count: number, unit: string, approx: boolean) => ...);
// format(3)("кг")(true);
//
// Типизируйте curry так, чтобы тип каждого шага и итоговый результат
// выводились из исходной функции, а неверный тип аргумента на любом
// шаге был ошибкой.

const curry = (fn) => {
  const collect = (collected) =>
    collected.length >= fn.length ? fn(...collected) : (arg) => collect([...collected, arg]);

  return collect([]);
};

const format = curry((count: number, unit: string, approx: boolean): string => {
  return `${approx ? "≈" : ""}${count} ${unit}`;
});

const result = format(3)("кг")(true); // должно быть string
format("3"); // должно быть ошибкой
