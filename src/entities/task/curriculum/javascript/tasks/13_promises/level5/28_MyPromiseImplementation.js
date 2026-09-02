// Реализация собственного Promise (MyPromise)
// Реализуйте класс MyPromise с состояниями pending, fulfilled, rejected и методами then и catch.

class MyPromise {
  constructor(executor) {
    // Решение тут
  }

  then(onFulfilled, onRejected) {
    // Решение тут
  }

  catch(onRejected) {
    // Решение тут
  }
}

// Пример вызова:
new MyPromise((resolve) => setTimeout(() => resolve(42), 100))
  .then((val) => console.log(val)); // 42
