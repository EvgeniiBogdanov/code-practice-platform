function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('TimeoutError')), timeoutMs);
  });

  return Promise.race([Promise.resolve(promise), timeoutPromise]);
}

const slowPromise = new Promise((resolve) => setTimeout(() => resolve('done'), 3000));

withTimeout(slowPromise, 1000)
  .then(console.log)
  .catch((err) => console.log(err.message)); // "TimeoutError"
