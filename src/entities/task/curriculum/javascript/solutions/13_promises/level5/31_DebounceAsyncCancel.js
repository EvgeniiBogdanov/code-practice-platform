const debounceAsync = (fn, ms) => {
  let timer = null;
  let activeController = null;
  let activeReject = null;

  return (...args) => {
    return new Promise((resolve, reject) => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }

      if (activeController) {
        activeController.abort();
        activeController = null;
      }

      if (activeReject) {
        activeReject(new DOMException("Aborted by new invocation", "AbortError"));
        activeReject = null;
      }

      activeReject = reject;

      timer = setTimeout(async () => {
        timer = null;
        const controller = new AbortController();
        activeController = controller;

        try {
          const result = await fn(...args, controller.signal);
          if (!controller.signal.aborted) {
            resolve(result);
          }
        } catch (err) {
          if (!controller.signal.aborted) {
            reject(err);
          }
        } finally {
          if (activeController === controller) {
            activeController = null;
            activeReject = null;
          }
        }
      }, ms);
    });
  };
};

// Пример вызова:
const search = (q, signal) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => resolve(`Result ${q}`), 100);
  signal?.addEventListener("abort", () => {
    clearTimeout(timer);
    reject(new DOMException("Aborted", "AbortError"));
  });
});

const debounced = debounceAsync(search, 50);
debounced("a").catch((err) => console.log("a cancelled:", err.name));
debounced("ab").then((res) => console.log("ab success:", res)); // "Result ab"
