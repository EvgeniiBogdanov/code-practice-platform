// Что выведет данный код в консоль и почему?

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  try {
    throw new ValidationError("Некорректные данные");
  } catch (err) {
    if (err instanceof ValidationError) {
      console.log("Обработана валидация:", err.message);
      throw err;
    }
  }
} catch (finalErr) {
  console.log("Внешний catch:", finalErr.name);
}
