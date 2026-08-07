const mirrors = [
  Promise.reject("зеркало 1 недоступно"),
  new Promise((resolve) => setTimeout(() => resolve("ответ от зеркала 2"), 100)),
  Promise.reject("зеркало 3 недоступно"),
];

async function getFromAnyMirror() {
  try {
    return await Promise.any(mirrors);
  } catch (err) {
    // err — это AggregateError со всеми причинами в err.errors
    return "Все зеркала недоступны";
  }
}

getFromAnyMirror().then(console.log); // "ответ от зеркала 2"
