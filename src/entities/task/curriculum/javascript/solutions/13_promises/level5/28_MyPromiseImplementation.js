class MyPromise {
  #state = "pending";
  #value = undefined;
  #handlers = [];
  #isResolving = false; // resolve/reject уже вызывали — повторные вызовы игнорируются

  constructor(executor) {
    const resolve = (value) => {
      if (this.#isResolving) return;
      this.#isResolving = true;
      this.#adopt(value);
    };

    const reject = (reason) => {
      if (this.#isResolving) return;
      this.#isResolving = true;
      this.#settle("rejected", reason);
    };

    try {
      executor(resolve, reject); // executor выполняется синхронно
    } catch (error) {
      reject(error);
    }
  }

  // Процедура разрешения: если value — thenable, промис «перенимает» его состояние
  #adopt(value) {
    if (value === this) {
      this.#settle("rejected", new TypeError("Промис не может разрешиться самим собой"));
      return;
    }

    const isObjectLike = value !== null && (typeof value === "object" || typeof value === "function");
    if (!isObjectLike) {
      this.#settle("fulfilled", value);
      return;
    }

    let then;
    try {
      then = value.then;
    } catch (error) {
      this.#settle("rejected", error);
      return;
    }

    if (typeof then !== "function") {
      this.#settle("fulfilled", value);
      return;
    }

    // Как и нативный Promise, вызываем then у thenable асинхронно
    queueMicrotask(() => {
      let isCalled = false; // thenable может вызвать оба колбэка — учитываем только первый
      try {
        then.call(
          value,
          (nextValue) => {
            if (isCalled) return;
            isCalled = true;
            this.#adopt(nextValue);
          },
          (reason) => {
            if (isCalled) return;
            isCalled = true;
            this.#settle("rejected", reason);
          }
        );
      } catch (error) {
        if (!isCalled) {
          isCalled = true;
          this.#settle("rejected", error);
        }
      }
    });
  }

  #settle(state, value) {
    if (this.#state !== "pending") return;
    this.#state = state;
    this.#value = value;
    // Обработчики, подписанные заранее, запускаются асинхронно и по порядку подписки
    this.#handlers.forEach((handler) => queueMicrotask(handler));
    this.#handlers = [];
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = () => {
        const isFulfilled = this.#state === "fulfilled";
        const callback = isFulfilled ? onFulfilled : onRejected;

        // Обработчика нет — значение или ошибка проходит дальше по цепочке
        if (typeof callback !== "function") {
          (isFulfilled ? resolve : reject)(this.#value);
          return;
        }

        try {
          resolve(callback(this.#value)); // результат (в том числе промис) разрешает следующий промис
        } catch (error) {
          reject(error);
        }
      };

      if (this.#state === "pending") {
        this.#handlers.push(handle);
      } else {
        queueMicrotask(handle);
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    // finally не получает аргументов и не меняет значение (если сам не бросил ошибку)
    return this.then(
      (value) => MyPromise.resolve(onFinally?.()).then(() => value),
      (reason) =>
        MyPromise.resolve(onFinally?.()).then(() => {
          throw reason;
        })
    );
  }

  static resolve(value) {
    return value instanceof MyPromise ? value : new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
}

// Пример вызова:
const total = await new MyPromise((resolve) => setTimeout(() => resolve(1), 50))
  .then((value) => value + 1)
  .then((value) => new MyPromise((resolve) => setTimeout(() => resolve(value * 10), 50)))
  .then((value) => `Итог: ${value}`);
console.log(total); // "Итог: 20"

const recovered = await new MyPromise(() => {
  throw new Error("Сбой в executor");
})
  .then(() => "не выполнится")
  .catch((error) => `Поймано: ${error.message}`);
console.log(recovered); // "Поймано: Сбой в executor"

const once = await new MyPromise((resolve, reject) => {
  resolve("первый");
  resolve("второй");
  reject(new Error("поздно"));
});
console.log(once); // "первый"

const afterFinally = await MyPromise.resolve("данные").finally(() => console.log("finally вызван"));
console.log(afterFinally); // "данные"

try {
  await MyPromise.reject(new Error("отклонён"));
} catch (error) {
  console.log(error.message); // "отклонён"
}

const order = [];
MyPromise.resolve("then").then((value) => order.push(value));
order.push("sync");
await MyPromise.resolve();
console.log(order); // ["sync", "then"]
