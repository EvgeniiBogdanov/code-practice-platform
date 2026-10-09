interface User {
  readonly id: number;
  name: string;
  email?: string;
  password: string;
}

type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

// Exclude оставляет ключи T, которых нет в K. Повторно используем MyPick,
// чтобы сохранить модификаторы.
type MyOmit<T, K extends PropertyKey> = MyPick<T, Exclude<keyof T, K>>;

type StrictOmit<T, K extends keyof T> = MyOmit<T, K>;

type Credentials = MyPick<User, "name" | "password">;
// { name: string; password: string }

type PublicUser = MyOmit<User, "password">;
// { readonly id: number; name: string; email?: string }

// MyPick<User, "age"> и StrictOmit<User, "pasword"> — ошибки: ключа нет в keyof User
// (проверяются в tests.ts).

const publicUser: PublicUser = { id: 1, name: "Alice" };
