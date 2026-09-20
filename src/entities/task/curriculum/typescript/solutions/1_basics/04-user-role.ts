interface User {
  name: string;
  age: number;
}

type Role = "admin" | "user";

interface UserWithRole extends User {
  role: Role;
}

const admin: UserWithRole = {
  name: "Alice",
  age: 30,
  role: "admin",
};
