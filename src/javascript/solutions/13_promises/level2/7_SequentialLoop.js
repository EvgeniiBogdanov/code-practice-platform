const ids = [1, 2, 3];
const fetchUser = (id) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ id, name: `User${id}` }), 300)
  );

async function loadAllSequentially() {
  const names = [];
  for (const id of ids) {
    const user = await fetchUser(id);
    names.push(user.name);
  }
  return names;
}

// Пример вызова:
loadAllSequentially().then(console.log); // ["User1", "User2", "User3"]
