const fetchUsers = async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error(`HTTP: ${res.status}`);;

    const users = await res.json();
    return users;
  } catch (e) {
    throw new Error(`Error: ${e.message}`);
  }
};
