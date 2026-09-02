const safeFetch = async (fetchFn) => {
  try {
    const data = await fetchFn();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Пример вызова:
safeFetch(() => Promise.resolve("OK")).then(console.log); // { data: "OK", error: null }
safeFetch(() => Promise.reject("Fail")).then(console.log); // { data: null, error: "Fail" }
