const fetchWithCancel = (url, signal) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(`Данные с ${url}`), 500);

    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new Error("Aborted"));
    });
  });
};

const controller = new AbortController();
fetchWithCancel("/api/data", controller.signal)
  .then(console.log)
  .catch(console.error); // Error: Aborted

setTimeout(() => controller.abort(), 100);
