// Повторные попытки асинхронной функции с задержкой (retry)
// Напишите функцию retry(fn, attempts, delayMs), которая повторяет вызов асинхронной функции fn в случае ошибки до attempts раз с паузой delayMs между попытками.

const retry = (fn, attempts, delayMs) => {
  // Решение тут
};

// Пример вызова:
let counter = 0;
const flaky = () => {
  counter++;
  return counter < 3 ? Promise.reject(`Попытка ${counter} провалена`) : Promise.resolve("Успех!");
};

retry(flaky, 5, 200).then(console.log).catch(console.error); // "Успех!"
