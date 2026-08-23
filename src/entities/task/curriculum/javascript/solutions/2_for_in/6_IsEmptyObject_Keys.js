const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Пример вызова:
console.log(isEmpty({}));              // true
console.log(isEmpty({ name: "Ann" })); // false
console.log(isEmpty({ 0: "zero" }));   // false
