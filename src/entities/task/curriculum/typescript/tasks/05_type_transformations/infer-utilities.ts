// Используя условные типы и infer, реализуйте без встроенных утилит:
//
// MyReturnType<F>  — тип результата функции;
// MyParameters<F>  — кортеж типов параметров функции;
// MyAwaited<T>     — тип значения после await, включая вложенные Promise;
// FirstArg<F>      — тип первого параметра функции.
//
// MyReturnType и MyParameters должны принимать только функции.

type MyReturnType<F> = unknown;
type MyParameters<F> = unknown;
type MyAwaited<T> = unknown;
type FirstArg<F> = unknown;

const log = (data: string[], count: number): boolean => data.length > count;

// MyReturnType<typeof log>                → boolean
// MyParameters<typeof log>                → [data: string[], count: number]
// MyAwaited<Promise<Promise<number>>>     → number
// FirstArg<typeof log>                    → string[]
// MyReturnType<string>                    → должно быть ошибкой
