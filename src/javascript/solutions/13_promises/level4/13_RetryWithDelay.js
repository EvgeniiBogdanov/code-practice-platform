let counter = 0;
const flaky = () => {
  counter++;
  return counter < 3 ? Promise.reject(`Попытка ${counter} провалена`) : Promise.resolve("Успех!");
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retry = async (fn, attempts, delayMs) => {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) await wait(delayMs);
    }
  }
  throw lastError;
};

retry(flaky, 5, 200).then(console.log).catch(console.error);
