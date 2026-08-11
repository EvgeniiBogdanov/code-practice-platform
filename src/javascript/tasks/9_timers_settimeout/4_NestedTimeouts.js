// Порядок выполнения вложенных таймеров
// Какой будет порядок вывода сообщений?

console.log("Start");

setTimeout(() => {
  console.log("Timeout 1");
  setTimeout(() => {
    console.log("Nested Timeout");
  }, 0);
}, 0);

setTimeout(() => {
  console.log("Timeout 2");
}, 0);

console.log("End");
