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
  let page = 1;
  while (page !== null) {
    // await внутри асинхронного генератора: ждём страницу
    const { items, nextPage } = await fetchPage(page);
    // yield* отдаёт элементы массива по одному
    yield* items;
    page = nextPage;
  }
}

async function collectFirst(n) {
  const result = [];
  if (n <= 0) {
    return result;
  }

  for await (const item of fetchAllItems()) {
    result.push(item);
    if (result.length >= n) {
      // break закрывает генератор: следующая страница не будет запрошена
      break;
    }
  }
  return result;
}

// Пример вызова:
const all = [];
for await (const item of fetchAllItems()) {
  all.push(item);
}
console.log(all); // ["a", "b", "c", "d", "e"]

requestedPages.length = 0;
console.log(await collectFirst(3)); // ["a", "b", "c"]
console.log(requestedPages); // [1, 2]
