const counterModule = (() => {
  // Приватное состояние: доступно только функциям внутри IIFE
  let count = 0;

  // Публичный API модуля
  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    getValue() {
      return count;
    },
    reset() {
      count = 0;
    },
  };
})();

// Пример вызова:
console.log(counterModule.increment()); // 1
console.log(counterModule.increment()); // 2
console.log(counterModule.decrement()); // 1
console.log(counterModule.getValue()); // 1
console.log(counterModule.count); // undefined — счётчик приватный
counterModule.reset();
console.log(counterModule.getValue()); // 0
