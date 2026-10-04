// Функции загрузки уже написаны. Не дублируя описания вручную, получите:
// 1. User — тип пользователя, который возвращает fetchUser после await;
// 2. Dashboard — тип результата loadDashboard после await
//    (пользователь и список его заказов);
// 3. ClientOptions — тип первого аргумента конструктора ApiClient.

const fetchUser = async (id: number) => {
  return { id, name: "Alice", roles: ["admin"] };
};

const fetchOrders = async (userId: number) => {
  return [{ id: 1, userId, total: 990 }];
};

const loadDashboard = async (userId: number) => {
  return Promise.all([fetchUser(userId), fetchOrders(userId)]);
};

class ApiClient {
  constructor(
    public options: { baseUrl: string; timeout: number },
    public token?: string
  ) {}
}

type User = unknown;
type Dashboard = unknown;
type ClientOptions = unknown;
