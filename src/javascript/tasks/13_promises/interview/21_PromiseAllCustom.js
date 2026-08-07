/** Реализуйте функцию promiseAll, которая работает аналогично встроенному Promise.all.
 * Функция принимает массив промисов (или обычных значений) и возвращает новый промис.
 * Возвращённый промис должен:
 *  - разрешиться массивом результатов в том же порядке, что и исходные промисы,
 *    когда все переданные промисы успешно выполнены;
 *  - отклониться с причиной первого промиса, который завершился с ошибкой;
 *  - сразу разрешиться пустым массивом, если передан пустой массив.
 */
function promiseAll(promises) {
  // Ваш код здесь
}

promiseAll([
  Promise.resolve(1),
  new Promise((resolve) => setTimeout(() => resolve(2), 100)),
  3,
]).then(console.log);

promiseAll([
  Promise.resolve(1),
  Promise.reject("Ошибка!"),
  Promise.resolve(3),
]).catch(console.log);

promiseAll([]).then(console.log);
