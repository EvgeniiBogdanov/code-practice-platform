// Есть несколько зеркал сервера. Нужно получить ответ
// от ПЕРВОГО, который ответит успешно, игнорируя тех,
// кто упал с ошибкой. Если упадут все — вывести
// "Все зеркала недоступны".

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
