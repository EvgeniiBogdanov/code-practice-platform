const parsePath = (path) => {
  if (Array.isArray(path)) return path.map(String);
  if (typeof path !== "string") return [];
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter((k) => k.length > 0);
};

const FORBIDDEN_KEYS = new Set(["__proto__", "prototype", "constructor"]);

const safeGet = (target, path, defaultValue) => {
  if (target === null || target === undefined) return defaultValue;
  const segments = parsePath(path);
  if (segments.length === 0) return target;

  let current = target;
  for (let i = 0; i < segments.length; i++) {
    const key = segments[i];
    if (FORBIDDEN_KEYS.has(key)) return defaultValue;
    if (current === null || current === undefined) return defaultValue;
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
};

const safeSet = (target, path, value) => {
  if (!target || typeof target !== "object") return target;
  const segments = parsePath(path);
  if (segments.length === 0) return target;

  let current = target;
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    if (FORBIDDEN_KEYS.has(key)) return target;

    const nextKey = segments[i + 1];
    const isNextIndex = /^\d+$/.test(nextKey);

    if (
      current[key] === null ||
      current[key] === undefined ||
      typeof current[key] !== "object"
    ) {
      current[key] = isNextIndex ? [] : {};
    }

    current = current[key];
  }

  const lastKey = segments[segments.length - 1];
  if (!FORBIDDEN_KEYS.has(lastKey)) {
    current[lastKey] = value;
  }

  return target;
};

// Пример вызова:
const state = { user: { profile: { tags: ["dev", "js"] } } };

console.log(safeGet(state, "user.profile.tags[1]")); // 'js'
console.log(safeGet(state, "user.settings.theme", "dark")); // 'dark'

const data = {};
safeSet(data, "order.items[0].id", 101);
console.log(data); // { order: { items: [ { id: 101 } ] } }

// Защита от Prototype Pollution:
safeSet(data, "__proto__.polluted", "hacked");
console.log({}.polluted); // undefined (глобальный Object.prototype в безопасности!)
