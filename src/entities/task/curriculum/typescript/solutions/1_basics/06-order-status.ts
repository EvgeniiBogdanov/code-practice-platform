enum OrderStatus {
  Pending = "pending",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

const status: OrderStatus = OrderStatus.Pending;

const changeStatus = (newStatus: OrderStatus): void => {
  console.log(`Статус изменён на ${newStatus}`);
};
