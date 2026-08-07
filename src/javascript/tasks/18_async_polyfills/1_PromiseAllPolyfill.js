// Полифил для Promise.all
// Напишите функцию promiseAll(promises), которая работает аналогично встроенному Promise.all:
// 1. Возвращает Promise.
// 2. Если массив пустой, резолвит его в [].
// 3. Возвращает результаты промисов в порядке исходного массива.
// 4. Корректно обрабатывает как Promise, так и обычные значения.
// 5. В случае отклонения хотя бы одного промиса — сразу отклоняет главный Promise с этой ошибкой.

function promiseAll(promises) {
  // Ваш код здесь
}

// Пример использования:
const p1 = Promise.resolve(10);
const p2 = new Promise((resolve) => setTimeout(() => resolve(20), 100));
const p3 = 30;

promiseAll([p1, p2, p3]).then(console.log).catch(console.error); // [10, 20, 30]
