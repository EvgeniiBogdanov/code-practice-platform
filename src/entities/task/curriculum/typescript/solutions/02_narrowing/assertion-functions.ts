// Функции-утверждения объявлены через function: для анализа потока
// управления имя вызываемой функции должно иметь явный тип.
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Ожидалась строка");
  }
}

const getApiUrl = (env: Record<string, string | undefined>): string => {
  const url = env.API_URL;
  assert(url !== undefined, "Переменная API_URL не задана");
  return url.toLowerCase(); // url: string
};

const shout = (value: unknown): string => {
  assertIsString(value);
  return value.toUpperCase(); // value: string
};

getApiUrl({ API_URL: "HTTPS://API.EXAMPLE.COM" });
shout("hello"); // "HELLO"
