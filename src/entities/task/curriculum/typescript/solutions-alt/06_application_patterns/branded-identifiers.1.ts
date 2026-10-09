// Альтернативный эталон: бренд через уникальный символ.
declare const userBrand: unique symbol;
declare const orderBrand: unique symbol;

type UserId = string & { readonly [userBrand]: true };
type OrderId = string & { readonly [orderBrand]: true };

const getUserById = (id: UserId): void => {
  // ...
};

const getOrderById = (id: OrderId): void => {
  // ...
};

const userId = "user-1" as UserId;
const orderId = "order-1" as OrderId;
