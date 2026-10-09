interface Todo {
  readonly id: number;
  title: string;
  done?: boolean;
}

type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// Примеры недопустимых присваиваний (frozen.title = "...", отсутствие done у
// MyRequired<Todo>) проверяются во вкладке tests.ts.
const frozen: MyReadonly<Todo> = { id: 1, title: "Купить хлеб" };

const draft: MyPartial<Todo> = {};

const editable: Mutable<Todo> = { id: 1, title: "Купить хлеб" };
editable.id = 2; // разрешено: readonly снят
