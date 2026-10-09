describe("greet", () => {
  test("принимает имя и необязательное приветствие, возвращает строку", () => {
    const short: string = greet("Alice");
    const full: string = greet("Alice", "Здравствуйте");
  });

  test("не принимает число вместо имени", () => {
    // @ts-expect-error
    greet(42);
  });
});

describe("sum", () => {
  test("принимает любое количество чисел и возвращает число", () => {
    const empty: number = sum();
    const total: number = sum(1, 2, 3);
  });

  test("не принимает строки", () => {
    // @ts-expect-error
    sum("1", 2);
  });
});

describe("applyToAll", () => {
  test("применяет числовое преобразование к массиву чисел", () => {
    const doubled: number[] = applyToAll([1, 2, 3], (n) => n * 2);
  });

  test("не принимает массив строк и преобразование строк", () => {
    // @ts-expect-error
    applyToAll(["a", "b"], (n) => n);
    // @ts-expect-error
    applyToAll([1, 2], (n: string) => n);
  });
});

test("logMessage принимает сообщение и необязательный уровень", () => {
  logMessage("Сервер запущен");
  logMessage("Сервер запущен", "warn");
  // @ts-expect-error
  logMessage(404);
});
