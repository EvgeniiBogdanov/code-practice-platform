type Curried<Args extends unknown[], R> = Args extends [infer First, ...infer Rest]
  ? (arg: First) => Rest extends [] ? R : Curried<Rest, R>
  : R;

const curry = <Args extends unknown[], R>(fn: (...args: Args) => R): Curried<Args, R> => {
  // Во время выполнения аргументы копятся в массиве переменной длины,
  // поэтому связь с рекурсивным типом Curried фиксируется в одной точке.
  const collect = (collected: unknown[]): unknown =>
    collected.length >= fn.length
      ? fn(...(collected as Args))
      : (arg: unknown) => collect([...collected, arg]);

  return collect([]) as Curried<Args, R>;
};

const format = curry((count: number, unit: string, approx: boolean): string => {
  return `${approx ? "≈" : ""}${count} ${unit}`;
});
// (arg: number) => (arg: string) => (arg: boolean) => string

const result = format(3)("кг")(true); // "≈3 кг"
// format("3"); // Ошибка: ожидается number
