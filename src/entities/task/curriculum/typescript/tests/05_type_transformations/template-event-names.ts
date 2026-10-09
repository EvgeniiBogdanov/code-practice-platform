test("EventHandlerName — onИмяСобытия для каждого события", () => {
  type _ = Expect<Equal<EventHandlerName, "onClick" | "onFocus" | "onHover">>;
});

test("допустимые названия обработчиков принимаются", () => {
  const click: EventHandlerName = "onClick";
  const hover: EventHandlerName = "onHover";
});

test("остальные строки отклоняются", () => {
  // @ts-expect-error
  const raw: EventHandlerName = "click";
  // @ts-expect-error
  const unknown: EventHandlerName = "onScroll";
});
