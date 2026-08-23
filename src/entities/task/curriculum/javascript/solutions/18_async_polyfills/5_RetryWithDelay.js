const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const retry = async (fn, maxRetries = 3, delayMs = 100) => {
  let lastError;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < maxRetries) {
        await delay(delayMs);
      }
    }
  }
  throw lastError;
};

let tries = 0;
const operation = () => {
  tries++;
  return tries < 3 ? Promise.reject(new Error("Fail")) : Promise.resolve("Success");
};

// Пример вызова:
retry(operation, 5, 50).then(console.log); // "Success"
