// Проверка объекта на пустоту (isEmpty)
// Напишите функцию isEmpty(obj), которая возвращает true, если переданный объект пуст (не содержит собственных строковых или Symbol-свойств), и false в противном случае.

const isEmpty = (obj) => {
  // Решение тут
};

// Пример вызова:
console.log(isEmpty({}));                   // true
console.log(isEmpty({ a: 1 }));             // false
console.log(isEmpty(Object.create(null)));  // true
console.log(isEmpty(null));                 // true
