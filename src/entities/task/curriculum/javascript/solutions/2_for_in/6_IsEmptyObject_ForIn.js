const isEmpty = (obj) => {
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      return false;
    }
  }

  return true;
};

// Пример вызова:
console.log(isEmpty({}));              // true
console.log(isEmpty({ name: "Ann" })); // false
console.log(isEmpty({ 0: "zero" }));   // false
