type NumberTransform = (value: number) => number;

const greet = (name: string, greeting = "Привет"): string => {
  return `${greeting}, ${name}!`;
};

const sum = (...numbers: number[]): number => {
  return numbers.reduce((total, n) => total + n, 0);
};

const applyToAll = (items: number[], transform: NumberTransform): number[] => {
  return items.map(transform);
};

const logMessage = (message: string, level?: string): void => {
  console.log(`[${level ?? "info"}] ${message}`);
};

greet("Alice"); // "Привет, Alice!"
sum(1, 2, 3); // 6
applyToAll([1, 2, 3], (n) => n * 2); // [2, 4, 6]
logMessage("Сервер запущен");
