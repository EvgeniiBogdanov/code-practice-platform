// Не используя встроенные Readonly, Partial и Required, реализуйте:
// MyReadonly<T> — все поля только для чтения;
// MyPartial<T>  — все поля необязательны;
// MyRequired<T> — все поля обязательны;
// Mutable<T>    — снимает readonly со всех полей.

interface Todo {
  readonly id: number;
  title: string;
  done?: boolean;
}

type MyReadonly<T> = unknown;
type MyPartial<T> = unknown;
type MyRequired<T> = unknown;
type Mutable<T> = unknown;

// Примеры недопустимых присваиваний (frozen.title = "...", отсутствие done у
// MyRequired<Todo>) проверяются во вкладке tests.ts.
const frozen: MyReadonly<Todo> = { id: 1, title: "Купить хлеб" };

const draft: MyPartial<Todo> = {};

const editable: Mutable<Todo> = { id: 1, title: "Купить хлеб" };
editable.id = 2; // разрешено: readonly снят
