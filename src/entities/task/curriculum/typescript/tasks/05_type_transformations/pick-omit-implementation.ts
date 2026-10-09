// Не используя встроенные Pick и Omit, реализуйте:
// MyPick<T, K>     — тип только с перечисленными ключами (ключи обязаны существовать в T);
// MyOmit<T, K>     — тип без перечисленных ключей;
// StrictOmit<T, K> — как MyOmit, но исключить можно только существующие ключи.
// Модификаторы readonly и ? исходных полей должны сохраняться.

interface User {
  readonly id: number;
  name: string;
  email?: string;
  password: string;
}

type MyPick<T, K> = unknown;
type MyOmit<T, K> = unknown;
type StrictOmit<T, K> = unknown;

type Credentials = MyPick<User, "name" | "password">;
type PublicUser = MyOmit<User, "password">;

// MyPick<User, "age"> и StrictOmit<User, "pasword"> должны быть ошибками
// (проверка во вкладке tests.ts).
