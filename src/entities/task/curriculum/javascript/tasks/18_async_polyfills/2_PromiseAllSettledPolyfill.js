// Реализация полифила Promise.allSettled
// Реализуйте функцию promiseAllSettled(promises), возвращающую массив результатов со статусами { status: 'fulfilled', value } или { status: 'rejected', reason }.

const promiseAllSettled = (promises) => {
  // Решение тут
};

// Пример вызова:
promiseAllSettled([
  Promise.resolve("ok"),
  Promise.reject("fail"),
]).then(console.log);
// [{ status: "fulfilled", value: "ok" }, { status: "rejected", reason: "fail" }]
