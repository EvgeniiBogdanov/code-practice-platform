const OrderStatus = {
  Pending: "pending",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
} as const;

// Одно имя для значения и для типа: TypeScript различает их по контексту.
type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

const changeStatus = (newStatus: OrderStatus): void => {
  console.log(`Статус изменён на ${newStatus}`);
};

changeStatus(OrderStatus.Pending);
changeStatus("shipped");
// changeStatus("lost"); // "lost" не входит в OrderStatus (проверяется в tests.ts)

const statusOptions: OrderStatus[] = Object.values(OrderStatus);
