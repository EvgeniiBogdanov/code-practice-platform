// Получение ответа от первого доступного сервера-зеркала
// Напишите функцию getFromAnyMirror(mirrors), которая возвращает ответ от первого успешно ответившего зеркала. Если упали все — возвращает ошибку "Все зеркала недоступны".

const mirrors = [
  Promise.reject("зеркало 1 недоступно"),
  new Promise((resolve) => setTimeout(() => resolve("ответ от зеркала 2"), 100)),
  Promise.reject("зеркало 3 недоступно"),
];

async function getFromAnyMirror() {
  // Решение тут
}

// Пример вызова:
getFromAnyMirror().then(console.log);
