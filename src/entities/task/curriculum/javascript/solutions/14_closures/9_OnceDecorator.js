const once = (fn) => {
  let executed = false;
  let cachedResult;

  return function (...args) {
    if (!executed) {
      executed = true;
      cachedResult = fn.apply(this, args);
    }
    return cachedResult;
  };
};

// Пример вызова:
let callCount = 0;
const pay = once((amount) => {
  callCount++;
  return `Оплачено: ${amount} руб. (транзакция #${callCount})`;
});

console.log(pay(500)); // 'Оплачено: 500 руб. (транзакция #1)'
console.log(pay(1000)); // 'Оплачено: 500 руб. (транзакция #1)'
console.log(callCount); // 1
