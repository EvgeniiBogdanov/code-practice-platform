const ids = [1, 2, 3];
const fetchUser = (id) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ id, name: `User${id}` }), 300)
  );

async function loadAllSequentially() {
  const names = [];
  for (const id of ids) {
    const user = await fetchUser(id); // именно for..of, forEach не сработает с await
    names.push(user.name);
  }
  return names;
}

loadAllSequentially().then(console.log);
