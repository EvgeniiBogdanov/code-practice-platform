class AppError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ValidationError extends AppError {}
class NetworkError extends AppError {}

const executeWithSelectiveRethrow = (taskFn, handledClasses = []) => {
  try {
    const data = taskFn();
    return { handled: true, success: true, data };
  } catch (err) {
    const isHandled = handledClasses.some(
      (ErrorClass) => typeof ErrorClass === "function" && err instanceof ErrorClass
    );

    if (isHandled) {
      return {
        handled: true,
        name: err.name,
        message: err.message,
        cause: err.cause,
      };
    }

    throw err;
  }
};

// Пример вызова:
const handled = executeWithSelectiveRethrow(
  () => {
    throw new ValidationError("Некорректный email", { cause: { field: "email" } });
  },
  [ValidationError]
);
console.log(handled);
// { handled: true, name: 'ValidationError', message: 'Некорректный email', cause: { field: 'email' } }
