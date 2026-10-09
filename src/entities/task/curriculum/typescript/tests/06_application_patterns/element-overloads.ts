test("img даёт объект с полем src", () => {
  const image = createElement("img");
  const src: string = image.src;
  // @ts-expect-error
  image.href;
});

test("a даёт объект с полем href", () => {
  const link = createElement("a");
  const href: string = link.href;
  // @ts-expect-error
  link.src;
});

test("любой другой тег даёт объект без дополнительных полей", () => {
  const block = createElement("div");
  const tag: string = block.tag;
  // @ts-expect-error
  block.src;
  // @ts-expect-error
  block.href;
});
