// Напишите асинхронную функцию safeLoad(), которая вызывает loadData() через await
// внутри блока try/catch. При ошибке возвращает строку `Не удалось загрузить: ${err}`.

const loadData = () => Promise.reject("сервер недоступен");

async function safeLoad() {
  // Решение тут
}

// Пример вызова:
safeLoad().then(console.log);
