const fetchWithCancel = async (url, signal, customFetch = fetch) => {
  if (signal?.aborted) {
    throw signal.reason || new DOMException("This operation was aborted", "AbortError");
  }

  const response = await customFetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Пример вызова:
const controller = new AbortController();

const mockFetch = (url, options) => {
  return new Promise((resolve, reject) => {
    if (options?.signal?.aborted) {
      return reject(new DOMException("Aborted", "AbortError"));
    }
    const timer = setTimeout(() => resolve({ ok: true, json: async () => ({ data: `Data from ${url}` }) }), 100);
    options?.signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
};

fetchWithCancel("/api/data", controller.signal, mockFetch)
  .then(console.log)
  .catch((err) => console.log(err.name)); // "AbortError"

setTimeout(() => controller.abort(), 30);
