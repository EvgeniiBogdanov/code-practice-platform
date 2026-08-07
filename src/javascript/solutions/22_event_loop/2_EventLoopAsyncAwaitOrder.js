/**
 * Решение задачи: Порядок выполнения async/await и Promise
 *
 * Порядок вывода в консоль:
 * 4: Script start
 * 1: asyncFn1 start
 * 3: asyncFn2 body
 * 6: Promise constructor
 * 8: Script end
 * 2: asyncFn1 end
 * 7: Promise then
 * 5: setTimeout
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

/*
Пошаговое объяснение:

1. СИНХРОННЫЙ КОД (Call Stack):
   - `console.log('4: Script start')` -> Вывод: "4: Script start".
   - `setTimeout` регистрируется -> колбэк идет в очередь МАКРОзадач.
   - Вызов `asyncFn1()`:
     - `console.log('1: asyncFn1 start')` -> Вывод: "1: asyncFn1 start".
     - Вызывается `asyncFn2()`, выполняется синхронно тело `asyncFn2()` -> `console.log('3: asyncFn2 body')` -> Вывод: "3: asyncFn2 body".
     - `asyncFn2()` возвращает резолвнутый промис.
     - Инструкция `await` приостанавливает выполнение `asyncFn1()`, а оставшаяся часть функции (`console.log('2: asyncFn1 end')`) планируется в очередь МИКРОзадач (эквивалентно `.then()`).
   - Исполнение возвращается в главный поток:
   - Конструктор `new Promise(...)` выполняется СИНХРОННО -> `console.log('6: Promise constructor')` -> Вывод: "6: Promise constructor".
   - Вызов `resolve()` переводит промис в состояние fulfilled и помещает колбэк из `.then(...)` (`console.log('7: Promise then')`) в очередь МИКРОзадач.
   - `console.log('8: Script end')` -> Вывод: "8: Script end".

2. ФАЗА МИКРОЗАДАЧ (Microtask Queue):
   В очереди микрозадач по порядку находятся:
   1) Продолжение `asyncFn1` после await ("2: asyncFn1 end")
   2) Колбэк `.then` ("7: Promise then")

   - Выполняется первая микрозадача -> Вывод: "2: asyncFn1 end".
   - Выполняется вторая микрозадача -> Вывод: "7: Promise then".
   - Очередь микрозадач пуста.

3. ФАЗА МАКРОЗАДАЧ (Macrotask Queue):
   - Выполняется колбэк `setTimeout` -> Вывод: "5: setTimeout".
*/
