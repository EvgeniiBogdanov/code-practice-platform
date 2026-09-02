const getFastestSuccess = (promises) => {
  return Promise.any(promises);
};

const p1 = new Promise((_, reject) => setTimeout(() => reject("Ошибка 1"), 100));
const p2 = new Promise((resolve) => setTimeout(() => resolve("Быстрый успех"), 200));
const p3 = new Promise((resolve) => setTimeout(() => resolve("Медленный успех"), 500));

// Пример вызова:
getFastestSuccess([p1, p2, p3]).then(console.log); // "Быстрый успех"
