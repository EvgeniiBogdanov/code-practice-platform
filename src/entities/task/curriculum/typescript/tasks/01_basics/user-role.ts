// Улучшите типизацию представленного кода.
// Поле role должно принимать только допустимые значения.

interface User {
  name: string;
  age: number;
}

interface UserWithRole {
  name: string;
  age: number;
  role: string;
}

const admin: UserWithRole = {
  name: "Alice",
  age: 30,
  role: "admin",
};
