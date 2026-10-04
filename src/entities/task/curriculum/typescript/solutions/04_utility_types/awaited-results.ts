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

type User = Awaited<ReturnType<typeof fetchUser>>;
// { id: number; name: string; roles: string[] }

type Dashboard = Awaited<ReturnType<typeof loadDashboard>>;
// [User, { id: number; userId: number; total: number }[]]

type ClientOptions = ConstructorParameters<typeof ApiClient>[0];
// { baseUrl: string; timeout: number }

const printDashboard = ([user, orders]: Dashboard): void => {
  console.log(`${user.name}: ${orders.length} заказ(ов)`);
};

loadDashboard(1).then(printDashboard);
