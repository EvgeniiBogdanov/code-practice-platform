interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, "password">;
type RegistrationForm = Pick<User, "name" | "password">;
