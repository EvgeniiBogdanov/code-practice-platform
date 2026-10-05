// Что выведет данный код в консоль и почему?
// Сценарии выполняются по очереди: каждый await ждёт завершения предыдущего.

// Сценарий 1: ошибка в цепочке
await Promise.resolve(1)
  .then((value) => {
    console.log("1. then:", value);
    throw new Error("Сбой");
  })
  .then(() => console.log("1. второй then"))
  .catch((error) => {
    console.log("1. catch:", error.message);
    return "восстановлено";
  })
  .then((value) => console.log("1. после catch:", value));

// Сценарий 2: второй аргумент then
await Promise.resolve()
  .then(
    () => {
      throw new Error("из onFulfilled");
    },
    () => console.log("2. onRejected")
  )
  .catch((error) => console.log("2. catch:", error.message));

// Сценарий 3: finally
const value = await Promise.resolve("данные").finally(() => "другое значение");
console.log("3.", value);

// Сценарий 4: async-функция и try/catch
const failing = async () => {
  throw new Error("async-сбой");
};
try {
  await failing();
} catch (error) {
  console.log("4. try/catch:", error.message);
}

// Сценарий 5: исключение в executor
const message = await new Promise(() => {
  throw new Error("в executor");
}).catch((error) => error.message);
console.log("5.", message);

// Сценарий 6: catch без return
const result = await Promise.reject(new Error("x")).catch(() => {});
console.log("6.", result);
