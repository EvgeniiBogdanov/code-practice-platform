interface ApiComment {
  id: number;
  email: string;
}

const COMMENTS_URL = "https://jsonplaceholder.typicode.com/comments";

const isApiComment = (value: unknown): value is ApiComment =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof value.id === "number" &&
  "email" in value &&
  typeof value.email === "string";

const getData = async (url: string): Promise<ApiComment[]> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить данные: HTTP ${response.status}`);
  }

  // response.json() возвращает any — сразу сохраняем результат как unknown.
  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every(isApiComment)) {
    throw new Error("Ответ сервера не соответствует ожидаемому формату");
  }

  return data; // ApiComment[]
};

getData(COMMENTS_URL).then((data) => {
  data.forEach(({ id, email }) => {
    console.log(`ID: ${id}, Email: ${email}`);
  });
});
