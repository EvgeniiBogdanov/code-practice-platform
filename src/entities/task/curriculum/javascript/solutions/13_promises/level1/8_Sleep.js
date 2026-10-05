// resolve передаётся в setTimeout напрямую: через ms миллисекунд промис выполнится
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const countdown = async (from) => {
  for (let i = from; i > 0; i--) {
    console.log(i);
    await sleep(100); // приостанавливаем функцию, не блокируя поток
  }
  console.log("Поехали!");
};

// Пример вызова:
const start = Date.now();
await sleep(300);
console.log(Date.now() - start >= 290); // true

await countdown(3); // 3, 2, 1, "Поехали!"
