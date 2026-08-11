const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Готово!");
    }, ms);
  });
};

// Пример вызова:
delay(1000).then((res) => console.log(res)); // "Готово!"
