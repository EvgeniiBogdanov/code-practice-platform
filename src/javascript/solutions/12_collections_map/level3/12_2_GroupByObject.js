const users = [
  { name: "Аня", city: "Москва" },
  { name: "Петя", city: "Питер" },
  { name: "Оля", city: "Москва" },
];

const groupBy = (items, key) => {
  const map = new Map();

  items.forEach((user) => {
    const group = user[key];

    if (!map.has(group)) map.set(group, []); 
    map.get(group).push(user);
  });

  return Object.fromEntries(map);
};

console.log(groupBy(users, "city"));
