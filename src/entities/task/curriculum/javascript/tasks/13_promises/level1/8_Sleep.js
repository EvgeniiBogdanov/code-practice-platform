// Функция задержки sleep(ms)
// Напишите функцию sleep(ms), которая возвращает Promise, выполняющийся через ms миллисекунд.
// Затем с её помощью напишите async-функцию countdown(from), которая выводит числа
// от from до 1 с паузой 100 мс и в конце пишет "Поехали!".

const sleep = (ms) => {
  // Решение тут
};

const countdown = async (from) => {
  // Решение тут
};

// Пример вызова:
const start = Date.now();
await sleep(300);
console.log(Date.now() - start >= 290); // true — прошло примерно 300 мс

await countdown(3); // 3, 2, 1, "Поехали!" с паузой 100 мс
