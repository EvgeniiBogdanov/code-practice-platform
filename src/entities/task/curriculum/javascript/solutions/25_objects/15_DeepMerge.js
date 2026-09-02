const isPlainObject = (item) => {
  return (
    item !== null &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    !(item instanceof Date) &&
    !(item instanceof RegExp)
  );
};

const deepMerge = (target, ...sources) => {
  if (!isPlainObject(target) && !Array.isArray(target)) {
    return target;
  }

  for (const source of sources) {
    if (!source || typeof source !== "object") {
      continue;
    }

    const keys = [...Object.keys(source), ...Object.getOwnPropertySymbols(source)];

    for (const key of keys) {
      // Защита от Prototype Pollution
      if (
        key === "__proto__" ||
        key === "prototype" ||
        key === "constructor"
      ) {
        continue;
      }

      const targetVal = target[key];
      const sourceVal = source[key];

      if (Array.isArray(targetVal) && Array.isArray(sourceVal)) {
        target[key] = [...targetVal, ...sourceVal];
      } else if (isPlainObject(targetVal) && isPlainObject(sourceVal)) {
        target[key] = deepMerge(targetVal, sourceVal);
      } else if (isPlainObject(sourceVal)) {
        target[key] = deepMerge({}, sourceVal);
      } else if (Array.isArray(sourceVal)) {
        target[key] = [...sourceVal];
      } else {
        target[key] = sourceVal;
      }
    }
  }

  return target;
};

// Пример вызова:
const defaultOptions = {
  api: {
    host: "localhost",
    port: 3000,
    headers: { "X-App": "MyApp" },
  },
  tags: ["dev"],
  debug: false,
};

const userOptions = {
  api: {
    port: 8080,
    headers: { Authorization: "Bearer token" },
  },
  tags: ["v2"],
  debug: true,
};

const merged = deepMerge({}, defaultOptions, userOptions);
console.log(merged.api.host);                       // 'localhost'
console.log(merged.api.port);                       // 8080
console.log(merged.api.headers["X-App"]);           // 'MyApp'
console.log(merged.api.headers.Authorization);      // 'Bearer token'
console.log(merged.tags);                           // ['dev', 'v2']
console.log(merged.debug);                          // true
