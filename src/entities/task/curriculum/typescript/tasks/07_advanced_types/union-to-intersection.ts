// Функция combine принимает несколько объектов-плагинов и возвращает
// объект со всеми их методами.
//
// 1. Реализуйте тип UnionToIntersection<U>, превращающий объединение
//    A | B | C в пересечение A & B & C.
// 2. Типизируйте combine так, чтобы тип результата был пересечением
//    типов всех переданных плагинов.

type UnionToIntersection<U> = unknown;

const combine = (...plugins) => {
  return plugins.reduce((result, plugin) => ({ ...result, ...plugin }), {});
};

const api = combine(
  { log: (message: string): void => console.log(message) },
  { now: (): number => Date.now() },
  { random: (max: number): number => Math.floor(Math.random() * max) }
);

api.log("Старт");
const timestamp = api.now(); // должно быть number
api.random("10"); // должно быть ошибкой
