// Сериализация и десериализация Map в JSON
// Напишите функции mapToJson(map) и jsonToMap(jsonString).

const mapToJson = (map) => {
  // Решение тут
};

const jsonToMap = (jsonString) => {
  // Решение тут
};

// Пример вызова:
const map = new Map([["a", 1], ["b", 2]]);
const json = mapToJson(map);
console.log(json);
console.log(jsonToMap(json).get("a")); // 1
