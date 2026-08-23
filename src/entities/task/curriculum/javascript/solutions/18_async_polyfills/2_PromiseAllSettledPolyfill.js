const promiseAllSettled = (promises) => {
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p).then(
        (value) => ({ status: "fulfilled", value }),
        (reason) => ({ status: "rejected", reason })
      )
    )
  );
};

promiseAllSettled([
  Promise.resolve("ok"),
  Promise.reject("fail"),
]).then(console.log);
// [{ status: "fulfilled", value: "ok" }, { status: "rejected", reason: "fail" }]
