const getUser = () => Promise.resolve({ id: 42, name: "Alex" });

getUser()
  .then((user) => user.id)
  .then((id) => console.log(`User id: ${id}`));
