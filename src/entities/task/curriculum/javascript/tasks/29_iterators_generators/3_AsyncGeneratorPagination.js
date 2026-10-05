// Асинхронный генератор и for await...of: постраничная загрузка
// Функция fetchPage(page) имитирует запрос к API и возвращает Promise
// с объектом { items, nextPage } (nextPage === null — страниц больше нет).
// 1. Напишите асинхронный генератор fetchAllItems(), который загружает страницы по очереди
//    и отдаёт элементы по одному (а не массивами).
// 2. Напишите функцию collectFirst(n), которая через for await...of собирает первые n элементов
//    и прекращает загрузку, как только их набрала: лишние страницы не запрашиваются.

const PAGES = {
  1: { items: ["a", "b"], nextPage: 2 },
  2: { items: ["c", "d"], nextPage: 3 },
  3: { items: ["e"], nextPage: null },
};

const requestedPages = [];
const fetchPage = (page) => {
  requestedPages.push(page);
  return new Promise((resolve) => setTimeout(() => resolve(PAGES[page]), 50));
};

async function* fetchAllItems() {
  // Решение тут
}

async function collectFirst(n) {
  // Решение тут
}

// Пример вызова:
const all = [];
for await (const item of fetchAllItems()) {
  all.push(item);
}
console.log(all); // ["a", "b", "c", "d", "e"]

requestedPages.length = 0;
console.log(await collectFirst(3)); // ["a", "b", "c"]
console.log(requestedPages); // [1, 2] — третья страница не запрашивалась
