# Разбор задачи: «Каррирование»

## 1. Что дано

`curry` превращает `f(a, b, c)` в `f(a)(b)(c)`. Во время выполнения функция просто копит аргументы, пока их не наберётся `fn.length`. Задача — описать тип, который из сигнатуры исходной функции строит цепочку функций с правильным типом на каждом шаге.

## 2. Что нужно получить

```ts
const format = curry((count: number, unit: string, approx: boolean): string => ...);
// format: (arg: number) => (arg: string) => (arg: boolean) => string
```

`format("3")` — ошибка на первом шаге, `format(3)("кг")(true)` — `string`.

## 3. Тип Curried: рекурсия по кортежу аргументов

Аргументы функции — кортеж `[number, string, boolean]`. Отрезаем первый элемент и строим функцию от него, а для остатка повторяем то же самое:

```ts
type Curried<Args extends unknown[], R> = Args extends [infer First, ...infer Rest]
  ? (arg: First) => Rest extends [] ? R : Curried<Rest, R>
  : R;
```

| Шаг | `Args` | Результат шага |
| --- | --- | --- |
| 1 | `[number, string, boolean]` | `(arg: number) => Curried<[string, boolean], string>` |
| 2 | `[string, boolean]` | `(arg: string) => Curried<[boolean], string>` |
| 3 | `[boolean]` | `(arg: boolean) => string` — остаток пуст |

Проверка `Rest extends []` останавливает рекурсию на последнем аргументе и возвращает результат исходной функции. Последняя ветка `: R` нужна для функции без аргументов.

## 4. Сигнатура curry

```ts
const curry = <Args extends unknown[], R>(fn: (...args: Args) => R): Curried<Args, R> => { ... };
```

TypeScript выводит `Args` как кортеж параметров переданной функции, а `R` — как её результат. Это тот же механизм, что и в `Parameters` и `ReturnType`, но без отдельного `infer`: вывод происходит из сопоставления аргумента с типом параметра.

## 5. Реализация и утверждение типа

```ts
const collect = (collected: unknown[]): unknown =>
  collected.length >= fn.length
    ? fn(...(collected as Args))
    : (arg: unknown) => collect([...collected, arg]);

return collect([]) as Curried<Args, R>;
```

Во время выполнения аргументы копятся в массиве переменной длины, и компилятор не может доказать, что результат совпадает с рекурсивным типом `Curried`. Поэтому реализация работает с `unknown`, а связь с типом фиксируется утверждениями в двух изолированных местах. Снаружи `curry` полностью типобезопасна. Так написаны `curry` в Ramda и lodash: строгий фасад над динамической реализацией.

### Полный код

```ts
type Curried<Args extends unknown[], R> = Args extends [infer First, ...infer Rest]
  ? (arg: First) => Rest extends [] ? R : Curried<Rest, R>
  : R;

const curry = <Args extends unknown[], R>(fn: (...args: Args) => R): Curried<Args, R> => {
  const collect = (collected: unknown[]): unknown =>
    collected.length >= fn.length
      ? fn(...(collected as Args))
      : (arg: unknown) => collect([...collected, arg]);

  return collect([]) as Curried<Args, R>;
};
```

## 6. Ограничения

- **fn.length** не учитывает rest-параметры и параметры со значениями по умолчанию: у `(a, b = 1) => ...` длина равна 1. Каррирование закончится раньше, чем ожидает тип.
- **Необязательные параметры.** `[infer First, ...infer Rest]` не совпадёт с кортежем, где первый элемент необязателен. Нужна отдельная ветка.
- **Перегрузки.** Из перегруженной функции выводится только последняя сигнатура.
- **Несколько аргументов за шаг** (`f(1, 2)(3)`) требуют вычисления префиксов кортежа — заметно более сложный тип.

## 7. Частые ошибки

- Использовать `Function` или `(...args: any[]) => any` и терять типы шагов.
- Не останавливать рекурсию на последнем аргументе и получить лишний уровень функции.
- Распространять `as` по всей реализации вместо изолированных точек.

## 8. Что запомнить

Кортеж параметров разбирается рекурсивно через `[infer First, ...infer Rest]`, и на каждом шаге строится функция от одного аргумента. Для динамических функций высшего порядка нормой считается строгий тип снаружи и изолированное утверждение внутри.
