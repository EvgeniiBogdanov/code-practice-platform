// presetArgs запоминаются в замыкании, laterArgs приходят при вызове
const partial =
  (fn, ...presetArgs) =>
  (...laterArgs) =>
    fn(...presetArgs, ...laterArgs);

// Пример вызова:
const multiply = (a, b, c) => a * b * c;
const double = partial(multiply, 2);
console.log(double(3, 4)); // 24

const sixTimes = partial(multiply, 2, 3);
console.log(sixTimes(5)); // 30

const log = (level, time, message) => `[${level}] ${time}: ${message}`;
const logError = partial(log, "ERROR");
console.log(logError("12:00", "Сервер недоступен")); // "[ERROR] 12:00: Сервер недоступен"

// bind делает то же самое, но первым аргументом фиксирует this
const logInfo = log.bind(null, "INFO");
console.log(logInfo("12:05", "Сервер снова работает")); // "[INFO] 12:05: Сервер снова работает"
