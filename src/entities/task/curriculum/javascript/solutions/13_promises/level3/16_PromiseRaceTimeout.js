const withTimeout = (promise, ms) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });
  return Promise.race([promise, timeoutPromise]);
};

const slowOp = new Promise((r) => setTimeout(() => r("Успех"), 500));
withTimeout(slowOp, 200).catch(console.error); // Error: Timeout
