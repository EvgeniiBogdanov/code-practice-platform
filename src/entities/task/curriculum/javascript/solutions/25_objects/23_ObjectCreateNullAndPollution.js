const createCleanDictionary = () => {
  return Object.create(null);
};

const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

const isPlainObject = (val) => {
  if (val === null || typeof val !== "object") return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto === Object.prototype;
};

const safeDeepAssign = (target, source) => {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return target;
  }

  for (const key of Object.keys(source)) {
    if (FORBIDDEN_KEYS.has(key)) {
      continue;
    }

    const sourceVal = source[key];
    if (isPlainObject(sourceVal)) {
      if (!isPlainObject(target[key])) {
        target[key] = Object.create(null);
      }
      safeDeepAssign(target[key], sourceVal);
    } else {
      target[key] = sourceVal;
    }
  }

  return target;
};

// Пример вызова:
const dict = createCleanDictionary();
console.log(Object.getPrototypeOf(dict)); // null
console.log(dict.toString); // undefined

const safeTarget = {};
const maliciousPayload = JSON.parse('{"__proto__": {"isAdmin": true, "role": "root"}}');

safeDeepAssign(safeTarget, maliciousPayload);

console.log(({}).isAdmin); // undefined
console.log(({}).role); // undefined
console.log(safeTarget.isAdmin); // undefined
