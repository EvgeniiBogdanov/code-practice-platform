const hasCircularReference = (rootObj) => {
  if (rootObj === null || typeof rootObj !== "object") {
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

    return false;
  };

  return traverse(rootObj);
};

// Пример вызова:
const acyclicTree = {
  id: 1,
  data: { values: [10, 20] },
  config: { theme: "dark" },
};
console.log(hasCircularReference(acyclicTree)); // false

const cyclicObj = { name: "Root" };
cyclicObj.self = cyclicObj;
console.log(hasCircularReference(cyclicObj)); // true

const complexCycleA = { name: "A" };
const complexCycleB = { parent: complexCycleA };
complexCycleA.child = complexCycleB;
console.log(hasCircularReference(complexCycleA)); // true
