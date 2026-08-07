/**
 * Решение задачи: Порядок выполнения в Event Loop
 *
 * Порядок вывода в консоль:
 * 1: Main script start
 * 8: Main script end
 * 4: Promise 1
 * 7: Promise 3
 * 5: Promise 2
 * 2: setTimeout 1
 * 3: Promise inside setTimeout 1
 * 6: setTimeout 2
 */

console.log('1: Main script start');

setTimeout(() => {
  console.log('2: setTimeout 1');
  Promise.resolve().then(() => {
    console.log('3: Promise inside setTimeout 1');
  });
}, 0);

Promise.resolve()
  .then(() => {
    console.log('4: Promise 1');
    return Promise.resolve();
  })
  .then(() => {
    console.log('5: Promise 2');
  });

setTimeout(() => {
  console.log('6: setTimeout 2');
}, 0);

Promise.resolve().then(() => {
  console.log('7: Promise 3');
});

console.log('8: Main script end');

/*
Пошаговое объяснение работы Event Loop:

1. СИНХРОННАЯ ФАЗА (Call Stack):
   - Выполняется `console.log('1: Main script start')` -> Вывод: "1: Main script start".
   - `setTimeout` (первый) регистрируется и его колбэк добавляется в очередь МАКРОзадач (Macrotask Queue / Task Queue).
   - Первый `Promise.resolve().then(...)` регистрирует колбэк "4: Promise 1" в очередь МИКРОзадач (Microtask Queue).
   - `setTimeout` (второй) регистрируется и его колбэк добавляется в очередь МАКРОзадач.
   - Второй `Promise.resolve().then(...)` регистрирует колбэк "7: Promise 3" в очередь МИКРОзадач.
   - Выполняется `console.log('8: Main script end')` -> Вывод: "8: Main script end".

2. ФАЗА МИКРОЗАДАЧ (Microtask Queue):
   Синхронный стек вызовов пуст. Event Loop опустошает очередь микрозадач ДО перехода к макрозадачам.
   - Очередь микрозадач сейчас: ["4: Promise 1", "7: Promise 3"].
   - Выполняется "4: Promise 1" -> Вывод: "4: Promise 1". Возвращается новый Promise, его следующий `.then("5: Promise 2")` помещается в конец очереди микрозадач.
   - Очередь микрозадач теперь: ["7: Promise 3", "5: Promise 2"].
   - Выполняется "7: Promise 3" -> Вывод: "7: Promise 3".
   - Выполняется "5: Promise 2" -> Вывод: "5: Promise 2".
   - Очередь микрозадач пуста!

3. ФАЗА МАКРОЗАДАЧ (Macrotask Queue):
   Event Loop берет ПЕРВУЮ макрозадачу из очереди.
   - Очередь макрозадач: [setTimeout 1, setTimeout 2].
   - Выполняется setTimeout 1:
     - Вывод: "2: setTimeout 1".
     - Внутри него планируется микрозадача `Promise.resolve().then(...)` -> добавляется в очередь микрозадач ("3: Promise inside setTimeout 1").
   - Перед переходом к СЛЕДУЮЩЕЙ макрозадаче Event Loop СНОВА полностью опустошает очередь микрозадач!
   - Выполняется микрозадача "3: Promise inside setTimeout 1" -> Вывод: "3: Promise inside setTimeout 1".
   - Очередь микрозадач снова пуста.
   - Event Loop берет следующую макрозадачу `setTimeout 2` -> Вывод: "6: setTimeout 2".
*/
