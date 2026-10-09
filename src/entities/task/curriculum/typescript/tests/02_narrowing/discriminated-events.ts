test("handleEvent принимает клик с координатами", () => {
  handleEvent({ type: "click", x: 10, y: 20 });
});

test("handleEvent принимает нажатие клавиши", () => {
  handleEvent({ type: "keypress", key: "Enter" });
});

test("поля событий разных видов не смешиваются", () => {
  // @ts-expect-error
  handleEvent({ type: "click", key: "Enter" });
  // @ts-expect-error
  handleEvent({ type: "keypress", x: 10, y: 20 });
});

test("неизвестный вид события отклоняется", () => {
  // @ts-expect-error
  handleEvent({ type: "scroll" });
});
