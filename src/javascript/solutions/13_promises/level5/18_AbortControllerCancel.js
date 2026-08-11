const fetchWithCancel = (url, signal) => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new Error("Aborted"));
    }

    const timer = setTimeout(() => {
      resolve(`Data from ${url}`);
    }, 200);

    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new Error("Aborted"));
    });
  });
};

const controller = new AbortController();
fetchWithCancel("/api/data", controller.signal)
  .then(console.log)
  .catch(console.error);

setTimeout(() => controller.abort(), 50);
