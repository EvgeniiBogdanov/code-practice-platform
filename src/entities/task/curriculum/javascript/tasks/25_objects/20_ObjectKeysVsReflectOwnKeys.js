// Интроспекция свойств: Object.keys vs Reflect.ownKeys
// Напишите функцию inspectObjectProperties(obj), которая:
// 1. Принимает объект obj и возвращает отчет со всеми типами его собственных свойств:
//    - enumerableStrings: массив собственных перечислимых строковых ключей (Object.keys).
//    - allStrings: массив всех собственных строковых ключей, включая неперечислимые (Object.getOwnPropertyNames).
//    - symbols: массив всех собственных Symbol-ключей (Object.getOwnPropertySymbols).
//    - allOwnKeys: массив абсолютно всех собственных ключей (Reflect.ownKeys).
// 2. Если передан null или значение, не являющееся объектом/функцией, возвращает пустые массивы для всех свойств.

const inspectObjectProperties = (obj) => {
  // Решение тут
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
