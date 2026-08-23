import { useState, useEffect } from "react";

// Кэш результатов запросов вне компонента (Module scope)
const cache = new Map();

const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const fetchPeople = async (name, status, signal) => {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (status) params.append("status", status);

  const cacheKey = params.toString();
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const res = await fetch(
      `https://rickandmortyapi.com/api/character?${cacheKey}`,
      { signal }
    );

    if (res.status === 404) {
      cache.set(cacheKey, []);
      return [];
    }
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

    const data = await res.json();
    const results = data.results || [];
    cache.set(cacheKey, results);
    return results;
  } catch (e) {
    throw e;
  }
};

const CharactersList = () => {
  const [name, setName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [characters, setCharacters] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const debouncedName = useDebounce(name, 300);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const loadCharacters = async () => {
      try {
        setStatus("loading");
        setError("");

        const data = await fetchPeople(debouncedName, statusFilter, signal);

        setCharacters(data);
        setStatus("success");
      } catch (e) {
        if (e.name === "AbortError") return;
        setError(e.message);
        setStatus("error");
      }
    };

    loadCharacters();

    return () => controller.abort();
  }, [debouncedName, statusFilter]);

  return (
    <div>
      <div>
        <label htmlFor="char-name">Имя:</label>
        <input
          id="char-name"
          type="text"
          placeholder="Поиск по имени..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="char-status">Статус:</label>
        <select
          id="char-status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      {status === "loading" && <p>Загрузка...</p>}
      {status === "error" && <p>Ошибка: {error}</p>}
      {status === "success" && !characters.length && <p>Персонажи не найдены</p>}

      <ul>
        {!!characters.length &&
          characters.map((char) => (
            <li key={char.id}>
              <img
                src={char.image}
                alt={char.name}
                width="50"
                height="50"
                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
              />
              <span>
                <strong>{char.name}</strong> ({char.status})
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CharactersList;
