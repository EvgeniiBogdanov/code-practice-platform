interface Todo {
  readonly id: number;
  title: string;
  done?: boolean;
}

type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

const frozen: MyReadonly<Todo> = { id: 1, title: "Купить хлеб" };
// frozen.title = "Изменить"; // Ошибка: поле только для чтения

const draft: MyPartial<Todo> = {};

const complete: MyRequired<Todo> = { id: 1, title: "Купить хлеб", done: false };

const editable: Mutable<Todo> = { id: 1, title: "Купить хлеб" };
editable.id = 2;
