const mirrors = [
  Promise.reject("зеркало 1 недоступно"),
  new Promise((resolve) => setTimeout(() => resolve("ответ от зеркала 2"), 100)),
  Promise.reject("зеркало 3 недоступно"),
];

async function getFromAnyMirror() {
  try {
    return await Promise.any(mirrors);
  } catch (err) {
    return "Все зеркала недоступны";
  }
}

// Пример вызова:
getFromAnyMirror().then(console.log); // "ответ от зеркала 2"
