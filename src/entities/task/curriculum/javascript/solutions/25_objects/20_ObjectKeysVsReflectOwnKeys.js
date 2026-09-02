const inspectObjectProperties = (obj) => {
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return {
      enumerableStrings: [],
      allStrings: [],
      symbols: [],
      allOwnKeys: [],
    };
  }

  return {
    enumerableStrings: Object.keys(obj),
    allStrings: Object.getOwnPropertyNames(obj),
    symbols: Object.getOwnPropertySymbols(obj),
    allOwnKeys: Reflect.ownKeys(obj),
  };
};

// Пример вызова:
const symId = Symbol("userId");
const symMeta = Symbol("meta");

const target = Object.create({ inheritedProp: "from_proto" });
target.publicField = "hello";

Object.defineProperty(target, "hiddenField", {
  value: "secret",
  enumerable: false,
});

target[symId] = 12345;
Object.defineProperty(target, symMeta, {
  value: { role: "admin" },
  enumerable: false,
});

const report = inspectObjectProperties(target);
console.log(report.enumerableStrings); // [ 'publicField' ]
console.log(report.allStrings); // [ 'publicField', 'hiddenField' ]
console.log(report.symbols.length); // 2
console.log(report.allOwnKeys.length); // 4
