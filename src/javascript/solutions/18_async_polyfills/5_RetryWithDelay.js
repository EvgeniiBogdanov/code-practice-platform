function retryWithDelay(fn, retries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    function attempt(attemptsLeft) {
      fn()
        .then(resolve)
        .catch((err) => {
          if (attemptsLeft <= 0) {
            return reject(err);
          }
          setTimeout(() => attempt(attemptsLeft - 1), delay);
        });
    }

    attempt(retries);
  });
}

// Пример использования:
let attempts = 0;
const unstableFetch = () =>
  new Promise((res, rej) => {
    attempts += 1;
    if (attempts < 3) {
      rej(`Ошибка сети (попытка ${attempts})`);
    } else {
      res(`Успех на попытке ${attempts}`);
    }
  });

retryWithDelay(unstableFetch, 4, 100).then(console.log).catch(console.error);
