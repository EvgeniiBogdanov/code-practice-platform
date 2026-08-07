// Напишите retry(fn, attempts, delayMs), которая вызывает
// асинхронную fn(), и если она упала — повторяет попытку
// до attempts раз с паузой delayMs между попытками.
// Если все попытки исчерпаны — пробросить последнюю ошибку.

let counter = 0;
const flaky = () => {
  counter++;
  return counter < 3 ? Promise.reject(`Попытка ${counter} провалена`) : Promise.resolve("Успех!");
};

const retry = (fn, attempts, delayMs) => {
  // Ваш код здесь
};

retry(flaky, 5, 200).then(console.log).catch(console.error);
