/**
 * Задача: Порядок выполнения async/await и Promise в Event Loop
 *
 * Подгруппа: Асинхронность и очереди
 *
 * Что выведется в консоль при выполнении данного кода?
 * Объясните, как async/await взаимодействует с микрозадачами Event Loop.
 */

async function asyncFn1() {
  console.log('1: asyncFn1 start');
  await asyncFn2();
  console.log('2: asyncFn1 end');
}

async function asyncFn2() {
  console.log('3: asyncFn2 body');
}

console.log('4: Script start');

setTimeout(() => {
  console.log('5: setTimeout');
}, 0);

asyncFn1();

new Promise((resolve) => {
  console.log('6: Promise constructor');
  resolve();
}).then(() => {
  console.log('7: Promise then');
});

console.log('8: Script end');

// 1. Напишите порядок вывода в консоль:
// Ваш ответ здесь

// 2. Объясните механизм работы await:
// Ваш ответ здесь
