const users = [
  { name: "Анна", city: "Москва" },
  { name: "Иван", city: "Казань" },
  { name: "Ольга", city: "Москва" },
  { name: "Петр", city: "Казань" },
];

const groupByCity = (users) => {
  const map = new Map();
  for (const user of users) {
    if (!map.has(user.city)) {
      map.set(user.city, []);
    }
    map.get(user.city).push(user);
  }
  return map;
};

// Пример вызова:
const grouped = groupByCity(users);
console.log(grouped.get("Москва").length); // 2
console.log(grouped.get("Казань").length); // 2
