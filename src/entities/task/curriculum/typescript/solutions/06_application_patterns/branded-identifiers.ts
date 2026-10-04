type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

const toUserId = (id: string): UserId => {
  return id as UserId;
};

const toOrderId = (id: string): OrderId => {
  return id as OrderId;
};

const getUserById = (id: UserId): void => {
  // ...
};

const getOrderById = (id: OrderId): void => {
  // ...
};

const userId = toUserId("user-1");
const orderId = toOrderId("order-1");

getUserById(userId); // ок
// getUserById(orderId); // Ошибка типов: OrderId нельзя передать как UserId
