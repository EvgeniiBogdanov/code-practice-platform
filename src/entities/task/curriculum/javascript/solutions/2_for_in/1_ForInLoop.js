const user = {
  name: "Алексей",
  age: 25,
  city: "Москва",
};

for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}
