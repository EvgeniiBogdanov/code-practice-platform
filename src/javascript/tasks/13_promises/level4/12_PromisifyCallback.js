// Дана функция в старом callback-стиле.
// Напишите promisify(fn), превращающую её в функцию,
// возвращающую Promise.

function readFileCallback(path, callback) {
  setTimeout(() => {
    if (path === "bad.txt") callback(new Error("Файл не найден"));
    else callback(null, `Содержимое ${path}`);
  }, 100);
}

const promisify = (fn) => {
  // Ваш код здесь
};

const readFile = promisify(readFileCallback);
readFile("data.txt").then(console.log).catch(console.error);
