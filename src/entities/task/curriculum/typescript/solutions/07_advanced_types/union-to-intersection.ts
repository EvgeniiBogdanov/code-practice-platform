// 1. Распределяем U и помещаем каждый вариант в параметр функции.
// 2. Выводим тип параметра из объединения функций: в контравариантной
//    позиции кандидаты объединяются пересечением.
type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (
  arg: infer I
) => void
  ? I
  : never;

type Combined<P extends object[]> = UnionToIntersection<P[number]>;

const combine = <P extends object[]>(...plugins: P): Combined<P> =>
  // Спред в reduce не отслеживает накопление типов, поэтому результат
  // связываем с вычисленным пересечением в одной точке.
  plugins.reduce<object>((result, plugin) => ({ ...result, ...plugin }), {}) as Combined<P>;

const api = combine(
  { log: (message: string): void => console.log(message) },
  { now: (): number => Date.now() },
  { random: (max: number): number => Math.floor(Math.random() * max) }
);
// { log: ... } & { now: ... } & { random: ... }

api.log("Старт");
const timestamp = api.now(); // number
// api.random("10"); // Ошибка: ожидается number
