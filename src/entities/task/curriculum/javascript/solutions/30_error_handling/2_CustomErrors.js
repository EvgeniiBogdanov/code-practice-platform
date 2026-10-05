class ValidationError extends Error {
  constructor(message, field, options) {
    // options ({ cause }) передаём в Error — стандарт ES2022
    super(message, options);
    this.name = "ValidationError";
    this.field = field;
  }
}

class RequiredFieldError extends ValidationError {
  constructor(field) {
    super(`Поле "${field}" обязательно`, field);
    this.name = "RequiredFieldError";
  }
}

const validateUser = (user) => {
  if (!user.name) {
    throw new RequiredFieldError("name");
  }
  if (!user.email) {
    throw new RequiredFieldError("email");
  }
  if (!user.email.includes("@")) {
    throw new ValidationError("Некорректный email", "email");
  }
  return true;
};

const saveUser = (user) => {
  try {
    validateUser(user);
    // ...здесь был бы запрос на сервер
  } catch (error) {
    // Обрабатываем только «свои» ошибки, остальные пробрасываем
    if (error instanceof ValidationError) {
      throw new Error("Не удалось сохранить пользователя", { cause: error });
    }
    throw error;
  }
};

// Пример вызова:
try {
  validateUser({ name: "Анна" });
} catch (error) {
  console.log(error.name); // "RequiredFieldError"
  console.log(error.message); // 'Поле "email" обязательно'
  console.log(error.field); // "email"
  console.log(error instanceof RequiredFieldError, error instanceof ValidationError); // true true
  console.log(error instanceof Error); // true
}

try {
  validateUser({ name: "Анна", email: "anna.mail.ru" });
} catch (error) {
  console.log(error.name, error.field); // "ValidationError" "email"
}

try {
  saveUser({ email: "a@b.ru" });
} catch (error) {
  console.log(error.message); // "Не удалось сохранить пользователя"
  console.log(error.cause.message); // 'Поле "name" обязательно'
}

try {
  saveUser(null);
} catch (error) {
  console.log(error.name); // "TypeError"
}

console.log(validateUser({ name: "Анна", email: "anna@mail.ru" })); // true
