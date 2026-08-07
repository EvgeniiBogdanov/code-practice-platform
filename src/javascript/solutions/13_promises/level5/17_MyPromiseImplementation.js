class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.callbacks = [];

    const resolve = (value) => {
      if (this.state !== "pending") return;
      this.state = "fulfilled";
      this.value = value;
      this.callbacks.forEach((cb) => cb.onFulfilled(value));
    };

    const reject = (reason) => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.value = reason;
      this.callbacks.forEach((cb) => cb.onRejected(reason));
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleFulfilled = (value) => {
        try {
          if (typeof onFulfilled === "function") {
            resolve(onFulfilled(value));
          } else {
            resolve(value);
          }
        } catch (err) {
          reject(err);
        }
      };

      const handleRejected = (reason) => {
        try {
          if (typeof onRejected === "function") {
            resolve(onRejected(reason));
          } else {
            reject(reason);
          }
        } catch (err) {
          reject(err);
        }
      };

      if (this.state === "fulfilled") {
        queueMicrotask(() => handleFulfilled(this.value));
      } else if (this.state === "rejected") {
        queueMicrotask(() => handleRejected(this.value));
      } else {
        this.callbacks.push({
          onFulfilled: handleFulfilled,
          onRejected: handleRejected,
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

new MyPromise((resolve) => setTimeout(() => resolve(10), 100))
  .then((v) => v * 2)
  .then((v) => console.log(v)) // 20
  .catch(console.error);
