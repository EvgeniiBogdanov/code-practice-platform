// Реализация собственного Promise (MyPromise)
// Реализуйте класс MyPromise с базовым поведением Promise:
// - состояния pending → fulfilled / rejected; состояние меняется только один раз;
// - executor вызывается синхронно; исключение в executor переводит промис в rejected;
// - then(onFulfilled, onRejected) возвращает НОВЫЙ MyPromise; обработчики вызываются
//   асинхронно (через queueMicrotask), даже если промис уже выполнен;
// - если обработчик вернул промис (или любой thenable), следующий промис ждёт его результата;
// - если обработчик не передан, значение или ошибка проходят дальше по цепочке;
// - catch(onRejected) и finally(onFinally);
// - статические методы MyPromise.resolve(value) и MyPromise.reject(reason).

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

  finally(onFinally) {
    // Решение тут
  }

  static resolve(value) {
    // Решение тут
  }

  static reject(reason) {
    // Решение тут
  }
}

// Пример вызова (await работает с любым thenable, в том числе с MyPromise):
const total = await new MyPromise((resolve) => setTimeout(() => resolve(1), 50))
  .then((value) => value + 1)
  .then((value) => new MyPromise((resolve) => setTimeout(() => resolve(value * 10), 50)))
  .then((value) => `Итог: ${value}`);
console.log(total); // "Итог: 20"

const recovered = await new MyPromise(() => {
  throw new Error("Сбой в executor");
})
  .then(() => "не выполнится")
  .catch((error) => `Поймано: ${error.message}`);
console.log(recovered); // "Поймано: Сбой в executor"

const once = await new MyPromise((resolve, reject) => {
  resolve("первый");
  resolve("второй");
  reject(new Error("поздно"));
});
console.log(once); // "первый"

const afterFinally = await MyPromise.resolve("данные").finally(() => console.log("finally вызван"));
console.log(afterFinally); // "finally вызван", затем "данные"

try {
  await MyPromise.reject(new Error("отклонён"));
} catch (error) {
  console.log(error.message); // "отклонён"
}

const order = [];
MyPromise.resolve("then").then((value) => order.push(value));
order.push("sync");
await MyPromise.resolve();
console.log(order); // ["sync", "then"] — обработчик выполнился асинхронно
