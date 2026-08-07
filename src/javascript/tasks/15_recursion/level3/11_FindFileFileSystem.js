// Дана структура файловой системы: { name, type: "file"|"folder", children? }.
// Напишите функцию findFile(node, name), возвращающую true, если файл найден.

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
  // Ваш код здесь
};

console.log(findFile(fs, "utils.js")); // true
