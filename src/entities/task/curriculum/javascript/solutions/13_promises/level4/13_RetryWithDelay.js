const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const retry = async (fn, attempts, delayMs) => {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await delay(delayMs);
      }
    }
  }
  throw lastError;
};

let counter = 0;
const flaky = () => {
  counter++;
  return counter < 3 ? Promise.reject(`Попытка ${counter} провалена`) : Promise.resolve("Успех!");
};

// Пример вызова:
retry(flaky, 5, 200).then(console.log).catch(console.error); // "Успех!"
