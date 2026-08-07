function readFileCallback(path, callback) {
  setTimeout(() => {
    if (path === "bad.txt") callback(new Error("Файл не найден"));
    else callback(null, `Содержимое ${path}`);
  }, 100);
}

const promisify = (fn) => {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
};

const readFile = promisify(readFileCallback);
readFile("data.txt").then(console.log).catch(console.error);
