class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.handlers = [];

    const resolve = (value) => {
      if (this.state !== "pending") return;
      this.state = "fulfilled";
      this.value = value;
      this.handlers.forEach((h) => h.onFulfilled(value));
    };

    const reject = (reason) => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.value = reason;
      this.handlers.forEach((h) => h.onRejected(reason));
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = () => {
        if (this.state === "fulfilled") {
          if (!onFulfilled) return resolve(this.value);
          try {
            resolve(onFulfilled(this.value));
          } catch (err) {
            reject(err);
          }
        } else if (this.state === "rejected") {
          if (!onRejected) return reject(this.value);
          try {
            resolve(onRejected(this.value));
          } catch (err) {
            reject(err);
          }
        } else {
          this.handlers.push({
            onFulfilled: (val) => {
              if (!onFulfilled) return resolve(val);
              try {
                resolve(onFulfilled(val));
              } catch (err) {
                reject(err);
              }
            },
            onRejected: (reason) => {
              if (!onRejected) return reject(reason);
              try {
                resolve(onRejected(reason));
              } catch (err) {
                reject(err);
              }
            },
          });
        }
      };

      queueMicrotask(handle);
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

// Пример вызова:
new MyPromise((resolve) => setTimeout(() => resolve(42), 100))
  .then((val) => console.log(val)); // 42
