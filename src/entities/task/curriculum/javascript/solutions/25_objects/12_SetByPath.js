const parsePath = (path) => {
  if (Array.isArray(path)) {
    return path.map(String);
  }
  if (typeof path !== "string" || path.length === 0) {
    return [];
  }

  return path
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".")
    .filter(Boolean);
};

const isIntegerKey = (key) => {
  return /^\d+$/.test(key);
};

const set = (obj, path, value) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  const keys = parsePath(path);
  if (keys.length === 0) {
    return obj;
  }

  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    // Защита от Prototype Pollution
    if (key === "__proto__" || key === "prototype" || key === "constructor") {
      return obj;
    }

    // Если свойства нет или оно не является объектом/массивом — создаем
    if (
      !current[key] ||
      typeof current[key] !== "object" ||
      current[key] === null
    ) {
      current[key] = isIntegerKey(nextKey) ? [] : {};
    }

    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  if (
    lastKey !== "__proto__" &&
    lastKey !== "prototype" &&
    lastKey !== "constructor"
  ) {
    current[lastKey] = value;
  }

  return obj;
};

// Пример вызова:
const obj1 = {};
set(obj1, "a.b.c", 42);
console.log(JSON.stringify(obj1));
// {"a":{"b":{"c":42}}}

const obj2 = {};
set(obj2, "users[0].name", "Alice");
set(obj2, "users[0].age", 25);
console.log(JSON.stringify(obj2));
// {"users":[{"name":"Alice","age":25}]}

const obj3 = { config: { active: false } };
set(obj3, "config.active", true);
console.log(obj3.config.active); // true
