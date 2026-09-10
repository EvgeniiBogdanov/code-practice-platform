// Проверка объекта на пустоту (isEmpty)
// Напишите функцию isEmpty(obj), которая возвращает true, если переданный объект пуст (не содержит собственных строковых или Symbol-свойств), и false в противном случае.
// Не-объекты и null считаются пустыми (true).

const isEmpty = (obj) => {
  // Решение тут
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
