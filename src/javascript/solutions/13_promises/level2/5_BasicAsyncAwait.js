const getUser = () => Promise.resolve({ id: 1, name: "Maria" });

async function loadUser() {
  const user = await getUser();
  return `Привет, ${user.name}`;
}

// Пример вызова:
loadUser().then(console.log);
