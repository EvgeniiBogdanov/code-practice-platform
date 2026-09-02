const isEmpty = (obj) => {
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return true;
  }

  // Проверка собственных строковых свойств с ранним выходом O(1)
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      return false;
    }
  }

  // Проверка Symbol-свойств
  const symbols = Object.getOwnPropertySymbols(obj);
  if (symbols.length > 0) {
    return false;
  }

  return true;
};

// Пример вызова:
console.log(isEmpty({}));                                      // true
console.log(isEmpty({ a: 1 }));                                // false
console.log(isEmpty(Object.create(null)));                     // true

const proto = { inherited: 100 };
const child = Object.create(proto);
console.log(isEmpty(child));                                   // true

const symbolKey = Symbol("id");
console.log(isEmpty({ [symbolKey]: 1 }));                      // false
console.log(isEmpty(null));                                     // true
console.log(isEmpty(123));                                      // true
