// Превращение callback-функции в Promise (promisify)
// Напишите функцию promisify(fn), оборачивающую асинхронную функцию с колбэком вида (err, data) в Promise.

const promisify = (fn) => {
  // Решение тут
};

// Пример вызова:
function readFileCallback(path, callback) {
  setTimeout(() => {
    if (path === "bad.txt") callback(new Error("Файл не найден"));
    else callback(null, `Содержимое ${path}`);
  }, 100);
}

const readFile = promisify(readFileCallback);
readFile("data.txt").then(console.log).catch(console.error);
