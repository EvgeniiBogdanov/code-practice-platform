const getUser = () => Promise.resolve({ id: 1, name: "Maria" });

async function loadUser() {
  const user = await getUser();
  return `Привет, ${user.name}`;
}

loadUser().then(console.log);
