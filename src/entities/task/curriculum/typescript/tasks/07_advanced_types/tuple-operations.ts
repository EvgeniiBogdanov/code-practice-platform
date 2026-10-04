// Реализуйте типы для работы с кортежами:
// First<T>      — первый элемент (never для пустого кортежа);
// Last<T>       — последний элемент (never для пустого кортежа);
// Length<T>     — длина кортежа как числовой литерал;
// Concat<A, B>  — склейка двух кортежей;
// Reverse<T>    — кортеж в обратном порядке.
//
// Затем типизируйте функцию concat(a, b) так, чтобы она возвращала
// кортеж точного вида: concat([1, "a"], [true]) → [1, "a", true].

type First<T> = unknown;
type Last<T> = unknown;
type Length<T> = unknown;
type Concat<A, B> = unknown;
type Reverse<T> = unknown;

const concat = (a, b) => [...a, ...b];

// First<[1, 2, 3]>          → 1
// Last<[1, 2, 3]>           → 3
// Length<[1, 2, 3]>         → 3
// Concat<[1], [2, 3]>       → [1, 2, 3]
// Reverse<[1, "a", true]>   → [true, "a", 1]
const joined = concat([1, "a"], [true]); // должно быть [1, "a", true]
