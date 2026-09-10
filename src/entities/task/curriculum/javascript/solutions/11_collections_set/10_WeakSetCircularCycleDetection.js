const hasCircularReference = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return false;
  }

  const visited = new WeakSet();

  const traverse = (current) => {
    if (current === null || typeof current !== "object") {
      return false;
    }

    if (visited.has(current)) {
      return true;
    }

    visited.add(current);

    for (const key of Object.keys(current)) {
      const value = current[key];
      if (typeof value === "object" && value !== null) {
        if (traverse(value)) {
          return true;
        }
      }
    }

    visited.delete(current);
    return false;
  };

  return traverse(obj);
};

// Пример вызова:
const objA = { name: "A" };
const objB = { name: "B", ref: objA };
console.log(hasCircularReference(objB)); // false

objA.ref = objB; // создали цикл: objA -> objB -> objA
console.log(hasCircularReference(objA)); // true
