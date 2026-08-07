const loadData = () => Promise.reject("сервер недоступен");

async function safeLoad() {
  try {
    const data = await loadData();
    return data;
  } catch (err) {
    return `Не удалось загрузить: ${err}`;
  }
}

safeLoad().then(console.log);
