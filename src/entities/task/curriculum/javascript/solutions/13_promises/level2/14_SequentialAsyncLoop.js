const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processSequentially = async (items) => {
  for (const item of items) {
    await delay(100);
    console.log(item);
  }
};

processSequentially(["первый", "второй", "третий"]).then(() => console.log("Готово!"));
