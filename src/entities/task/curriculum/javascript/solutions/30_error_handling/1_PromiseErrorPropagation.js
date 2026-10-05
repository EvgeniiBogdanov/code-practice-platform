// Сценарий 1: throw переводит цепочку в rejected — все then пропускаются до ближайшего catch.
// catch возвращает значение — цепочка снова fulfilled.
await Promise.resolve(1)
  .then((value) => {
    console.log("1. then:", value); // "1. then: 1"
    throw new Error("Сбой");
  })
  .then(() => console.log("1. второй then")) // пропущен
  .catch((error) => {
    console.log("1. catch:", error.message); // "1. catch: Сбой"
    return "восстановлено";
  })
  .then((value) => console.log("1. после catch:", value)); // "1. после catch: восстановлено"

// Сценарий 2: onRejected ловит только ошибки ПРЕДЫДУЩЕГО промиса,
// а не ошибку из onFulfilled того же then
await Promise.resolve()
  .then(
    () => {
      throw new Error("из onFulfilled");
    },
    () => console.log("2. onRejected") // не вызывается
  )
  .catch((error) => console.log("2. catch:", error.message)); // "2. catch: из onFulfilled"

// Сценарий 3: возвращаемое значение finally игнорируется — значение проходит дальше
const value = await Promise.resolve("данные").finally(() => "другое значение");
console.log("3.", value); // "3. данные"

// Сценарий 4: throw внутри async-функции = отклонённый промис; await пробрасывает его в try/catch
const failing = async () => {
  throw new Error("async-сбой");
};
try {
  await failing();
} catch (error) {
  console.log("4. try/catch:", error.message); // "4. try/catch: async-сбой"
}

// Сценарий 5: синхронное исключение в executor превращается в reject
const message = await new Promise(() => {
  throw new Error("в executor");
}).catch((error) => error.message);
console.log("5.", message); // "5. в executor"

// Сценарий 6: catch без return «гасит» ошибку и даёт undefined
const result = await Promise.reject(new Error("x")).catch(() => {});
console.log("6.", result); // "6. undefined"
