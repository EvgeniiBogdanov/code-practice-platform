const deepClone = (value, visited = new WeakMap()) => {
  // 1. Примитивы и функции возвращаются без изменений
  if (value === null || typeof value !== "object") {
    return value;
  }

  // 2. Специфические встроенные типы: Date и RegExp
  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  // 3. Защита от зацикливания: если объект уже клонировался в этой ветке — возвращаем его копию
  if (visited.has(value)) {
    return visited.get(value);
  }

  // 4. Инициализация контейнера (Array или Object)
  const clone = Array.isArray(value) ? [] : {};
  visited.set(value, clone);

  // 5. Рекурсивное копирование всех собственных свойств (включая Symbol)
  const keys = [...Object.keys(value), ...Object.getOwnPropertySymbols(value)];

  for (const key of keys) {
    clone[key] = deepClone(value[key], visited);
  }

  return clone;
};

// Пример вызова:
const original = {
  name: "Alice",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  pattern: /hello/gi,
  skills: ["React", "JavaScript"],
  nested: { count: 42 },
};

original.self = original;

const copy = deepClone(original);
console.log(copy !== original);                  // true
console.log(copy.nested !== original.nested);    // true
console.log(copy.skills !== original.skills);    // true
console.log(copy.createdAt instanceof Date);     // true
console.log(copy.createdAt.toISOString());       // '2025-01-01T00:00:00.000Z'
console.log(copy.pattern instanceof RegExp);     // true
console.log(copy.self === copy);                 // true
