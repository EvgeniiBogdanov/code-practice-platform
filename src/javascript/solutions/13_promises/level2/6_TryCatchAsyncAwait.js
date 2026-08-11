const loadData = () => Promise.reject("сервер недоступен");

async function safeLoad() {
  try {
    const data = await loadData();
    return data;
  } catch (err) {
    return `Не удалось загрузить: ${err}`;
  }
}

// Пример вызова:
safeLoad().then(console.log);
