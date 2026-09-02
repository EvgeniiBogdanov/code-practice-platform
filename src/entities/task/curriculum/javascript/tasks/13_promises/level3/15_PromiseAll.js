// Параллельное выполнение запросов через Promise.all
// Напишите функцию fetchDashboardData(), которая параллельно запрашивает пользователя, новости и баланс, возвращая единый объект { user, news, balance }.

const getUser = () => Promise.resolve({ name: "Иван" });
const getNews = () => Promise.resolve(["Новость 1", "Новость 2"]);
const getBalance = () => Promise.resolve(1500);

const fetchDashboardData = async () => {
  // Решение тут
};

// Пример вызова:
fetchDashboardData().then(console.log);
// { user: { name: 'Иван' }, news: [ 'Новость 1', 'Новость 2' ], balance: 1500 }
