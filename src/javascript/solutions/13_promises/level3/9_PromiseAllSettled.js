const requests = [
  Promise.resolve(1),
  Promise.reject("ошибка А"),
  Promise.resolve(3),
  Promise.reject("ошибка Б"),
];

async function splitResults() {
  const results = await Promise.allSettled(requests);

  const fulfilled = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  const rejected = results
    .filter((r) => r.status === "rejected")
    .map((r) => r.reason);

  return { fulfilled, rejected };
}

// Пример вызова:
splitResults().then(console.log);
// { fulfilled: [1, 3], rejected: ["ошибка А", "ошибка Б"] }
