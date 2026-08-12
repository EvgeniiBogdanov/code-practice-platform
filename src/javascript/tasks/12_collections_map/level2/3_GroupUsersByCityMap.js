// Группировка пользователей по городам через Map
// Напишите функцию groupByCity(users), возвращающую Map с массивами пользователей по городам.

/*
  Пример результата:
  Map(2) {
    "Москва" => [ { name: "Анна", city: "Москва" }, { name: "Ольга", city: "Москва" } ],
    "Казань" => [ { name: "Иван", city: "Казань" }, { name: "Петр", city: "Казань" } ]
  }
*/

const users = [
  { name: "Анна", city: "Москва" },
  { name: "Иван", city: "Казань" },
  { name: "Ольга", city: "Москва" },
  { name: "Петр", city: "Казань" },
];

const groupByCity = (users) => {
  // Решение тут
};

// Пример вызова:
const grouped = groupByCity(users);
console.log(grouped.get("Москва").length); // 2
console.log(grouped.get("Казань").length); // 2
