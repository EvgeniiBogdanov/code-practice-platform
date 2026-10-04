interface User {
  name: string;
  age: number;
}

type ValidationErrors = Partial<Record<keyof User, string>>;

type ValidationResult =
  | { ok: true; user: User }
  | { ok: false; errors: ValidationErrors };

const validateUser = (name: string, age: number): ValidationResult => {
  const errors: ValidationErrors = {};

  if (name.trim().length === 0) {
    errors.name = "Имя не может быть пустым";
  }

  if (age < 18) {
    errors.age = "Пользователь должен быть совершеннолетним";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, user: { name, age } };
};

const result = validateUser("Alice", 30);

if (result.ok) {
  console.log(`Добро пожаловать, ${result.user.name}`);
} else {
  console.log(result.errors.name ?? result.errors.age);
}
