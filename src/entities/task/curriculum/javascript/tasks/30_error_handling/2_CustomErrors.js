// Собственные классы ошибок
// 1. Класс ValidationError наследует Error: name === "ValidationError", поле field — имя поля.
// 2. Класс RequiredFieldError наследует ValidationError с сообщением `Поле "${field}" обязательно`.
// 3. validateUser(user) бросает RequiredFieldError для пустых name и email,
//    ValidationError("Некорректный email", "email"), если в email нет "@", и возвращает true.
// 4. saveUser(user) вызывает validateUser. При ошибке валидации бросает
//    Error("Не удалось сохранить пользователя") с исходной ошибкой в cause.
//    Остальные ошибки пробрасываются без изменений.

class ValidationError extends Error {
  // Решение тут
}

class RequiredFieldError extends ValidationError {
  // Решение тут
}

const validateUser = (user) => {
  // Решение тут
};

const saveUser = (user) => {
  // Решение тут
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
  console.log(error.name); // "TypeError" — неизвестная ошибка проброшена как есть
}

console.log(validateUser({ name: "Анна", email: "anna@mail.ru" })); // true
