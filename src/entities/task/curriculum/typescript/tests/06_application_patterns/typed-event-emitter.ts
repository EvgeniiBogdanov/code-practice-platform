test("подписчик получает данные своего события", () => {
  const events = new EventEmitter<EventMap>();
  events.on("userCreated", (user) => {
    const id: number = user.id;
    const name: string = user.name;
  });
  events.on("userDeleted", (payload) => {
    const id: number = payload.id;
    // @ts-expect-error
    payload.name;
  });
});

test("подписаться на несуществующее событие нельзя", () => {
  const events = new EventEmitter<EventMap>();
  // @ts-expect-error
  events.on("userRenamed", () => {});
});

test("emit проверяет данные события", () => {
  const events = new EventEmitter<EventMap>();
  events.emit("userCreated", { id: 1, name: "Alice" });
  // @ts-expect-error
  events.emit("userCreated", { id: 1 });
  // @ts-expect-error
  events.emit("userDeleted", { name: "Alice" });
});

test("обработчик с неверным типом аргумента отклоняется", () => {
  const events = new EventEmitter<EventMap>();
  // @ts-expect-error
  events.on("userDeleted", (payload: string) => {});
});
