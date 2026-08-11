const slowRequest = new Promise((resolve) =>
  setTimeout(() => resolve("данные"), 2000)
);

const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
  return Promise.race([promise, timeout]);
};

// Пример вызова:
withTimeout(slowRequest, 500).then(console.log).catch(console.error);
