// Обработка ошибок в асинхронных функциях
// Напишите функцию safeExecute(asyncFn), которая вызывает переданную асинхронную функцию и возвращает { ok: true, data } при успехе или { ok: false, error } при ошибке.

const safeExecute = async (asyncFn) => {
  // Решение тут
};

// Пример вызова:
safeExecute(async () => 42).then(console.log); // { ok: true, data: 42 }
safeExecute(async () => { throw new Error("Упс"); }).then(console.log); // { ok: false, error: "Упс" }
