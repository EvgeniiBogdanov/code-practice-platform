import { useState, useEffect } from "react";

const fetchUsers = async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error(`HTTP: ${res.status}`);

    const data = await res.json();
    return data;
  } catch (e) {
    throw new Error(`Error: ${e.message}`);
  }
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [erorr, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setStatus("load");
        const data = await fetchUsers();
        setUsers(data);
        setStatus("succes");
      } catch (e) {
        setError(e.message);
        setStatus("error");
      }
    };
    loadUsers();
  }, []);

  return (
    <div>
      {status === "load" && "Загрузка"}
      {status === "error" && `Ошибка: ${error}`}
      <ul>
        {!!users.length &&
          users.map((user) => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
};

export default UsersList;
