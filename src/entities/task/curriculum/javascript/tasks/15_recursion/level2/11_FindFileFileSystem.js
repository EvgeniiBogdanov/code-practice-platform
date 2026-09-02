// Поиск файла в файловой структуре
// Напишите функцию findFile(node, name), которая выполняет поиск файла с именем name в дереве файловой структуры и возвращает true/false.

const fs = {
  name: "root",
  type: "folder",
  children: [
    { name: "index.js", type: "file" },
    {
      name: "src",
      type: "folder",
      children: [
        { name: "app.js", type: "file" },
        { name: "utils.js", type: "file" },
      ],
    },
  ],
};

const findFile = (node, name) => {
  // Решение тут
};

// Пример вызова:
console.log(findFile(fs, "utils.js")); // true
console.log(findFile(fs, "test.js"));  // false
