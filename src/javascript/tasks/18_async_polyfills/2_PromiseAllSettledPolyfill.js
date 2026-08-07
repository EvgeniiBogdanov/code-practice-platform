// Полифил для Promise.allSettled
// Напишите функцию promiseAllSettled(promises), которая дожидается выполнения всех промисов
// (как успешно завершившихся, так и завершившихся с ошибкой) и возвращает массив их результатов.
// Каждый элемент результата должен иметь вид:
// { status: 'fulfilled', value: val } или { status: 'rejected', reason: err }

function promiseAllSettled(promises) {
  // Ваш код здесь
}

// Пример использования:
const p1 = Promise.resolve(42);
const p2 = Promise.reject("Ошибка сервера");
const p3 = new Promise((resolve) => setTimeout(() => resolve("Успех"), 50));

promiseAllSettled([p1, p2, p3]).then(console.log);
// [
//   { status: 'fulfilled', value: 42 },
//   { status: 'rejected', reason: 'Ошибка сервера' },
//   { status: 'fulfilled', value: 'Успех' }
// ]
