// Полифил Promise.allSettled
// Реализуйте функцию promiseAllSettled(promises).

const promiseAllSettled = (promises) => {
  // Решение тут
};

// Пример вызова:
promiseAllSettled([
  Promise.resolve("ok"),
  Promise.reject("fail"),
]).then(console.log);
// [{ status: "fulfilled", value: "ok" }, { status: "rejected", reason: "fail" }]
