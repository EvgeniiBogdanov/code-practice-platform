const splitResults = async (requests) => {
  const results = await Promise.allSettled(requests);
  const fulfilled = [];
  const rejected = [];

  for (const r of results) {
    if (r.status === "fulfilled") fulfilled.push(r.value);
    else rejected.push(r.reason);
  }

  return { fulfilled, rejected };
};

const reqs = [
  Promise.resolve(1),
  Promise.reject("ошибка А"),
  Promise.resolve(3),
  Promise.reject("ошибка Б"),
];

// Пример вызова:
splitResults(reqs).then(console.log);
// { fulfilled: [1, 3], rejected: ["ошибка А", "ошибка Б"] }
