const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  };
};

function readFileCallback(path, callback) {
  setTimeout(() => {
    if (path === "bad.txt") callback(new Error("Файл не найден"));
    else callback(null, `Содержимое ${path}`);
  }, 100);
}

// Пример вызова:
const readFile = promisify(readFileCallback);
readFile("data.txt").then(console.log).catch(console.error); // "Содержимое data.txt"
