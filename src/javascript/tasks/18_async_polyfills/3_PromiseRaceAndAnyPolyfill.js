// Полифилы для Promise.race и Promise.any
// Реализуйте две функции:
// 1. promiseRace(promises) — возвращает результат (или ошибку) первого завершившегося промиса.
// 2. promiseAny(promises) — возвращает результат первого УСПЕШНО завершившегося промиса.
//    Если все промисы отклонены, функция должна отклонить Promise с AggregateError или объектом ошибки, содержащим массив ошибок.

function promiseRace(promises) {
  // Ваш код здесь
}

function promiseAny(promises) {
  // Ваш код здесь
}

// Пример использования:
const slow = new Promise((resolve) => setTimeout(() => resolve("slow"), 200));
const fast = new Promise((resolve) => setTimeout(() => resolve("fast"), 50));
const failure = new Promise((_, reject) => setTimeout(() => reject("fail"), 10));

promiseRace([slow, fast]).then(console.log); // "fast"

promiseAny([failure, slow, fast]).then(console.log); // "fast"
