const diffObjects = (baseObj, targetObj) => {
  const base = baseObj && typeof baseObj === "object" ? baseObj : {};
  const target = targetObj && typeof targetObj === "object" ? targetObj : {};

  const added = {};
  const updated = {};
  const deleted = [];

  const baseKeys = Object.keys(base);
  const targetKeys = Object.keys(target);

  for (let i = 0; i < targetKeys.length; i++) {
    const key = targetKeys[i];
    if (!(key in base)) {
      added[key] = target[key];
    } else if (base[key] !== target[key]) {
      updated[key] = target[key];
    }
  }

  for (let i = 0; i < baseKeys.length; i++) {
    const key = baseKeys[i];
    if (!(key in target)) {
      deleted.push(key);
    }
  }

  return { added, updated, deleted };
};

const patchObject = (baseObj, diff) => {
  const base = baseObj && typeof baseObj === "object" ? baseObj : {};
  const result = { ...base };

  if (diff && typeof diff === "object") {
    if (Array.isArray(diff.deleted)) {
      for (let i = 0; i < diff.deleted.length; i++) {
        delete result[diff.deleted[i]];
      }
    }
    if (diff.added && typeof diff.added === "object") {
      Object.assign(result, diff.added);
    }
    if (diff.updated && typeof diff.updated === "object") {
      Object.assign(result, diff.updated);
    }
  }

  return result;
};

// Пример вызова:
const initial = { a: 1, b: 2, c: 3 };
const updated = { b: 20, c: 3, d: 4 };

const diff = diffObjects(initial, updated);
console.log(diff);
// {
//   added: { d: 4 },
//   updated: { b: 20 },
//   deleted: [ 'a' ]
// }

const restored = patchObject(initial, diff);
console.log(restored); // { b: 20, c: 3, d: 4 }
console.log(initial); // { a: 1, b: 2, c: 3 } (исходный не мутирован!)
