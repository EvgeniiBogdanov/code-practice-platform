// Альтернативный эталон: публичные поля перечислены через Pick.
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Pick<User, "id" | "name" | "email">;
type RegistrationForm = Pick<User, "name" | "password">;
