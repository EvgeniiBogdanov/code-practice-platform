// Защита словаря от Prototype Pollution
// Напишите функцию createSafeDictionary(), возвращающую чистый словарь без прототипа, защищенный от перезаписи свойств Object.prototype.

const createSafeDictionary = () => {
  // Решение тут
};

// Пример вызова:
const dict = createSafeDictionary();
dict["toString"] = 42;
console.log(dict["toString"]); // 42
console.log(typeof Object.prototype.toString); // "function" (не поврежден)
