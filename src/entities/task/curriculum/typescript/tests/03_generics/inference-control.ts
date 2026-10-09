describe("createMachine", () => {
  test("состояния выводятся из переданного массива", () => {
    const machine = createMachine(["idle", "loading"], "idle");
    const state: "idle" | "loading" = machine.getState();
    // @ts-expect-error
    const narrow: "idle" = machine.getState();
  });

  test("transition принимает только известные состояния", () => {
    const machine = createMachine(["idle", "loading"], "idle");
    machine.transition("loading");
    // @ts-expect-error
    machine.transition("done");
  });

  test("начальное состояние проверяется по списку", () => {
    createMachine(["idle", "loading"], "loading");
    // @ts-expect-error
    createMachine(["idle", "loading"], "idel");
  });
});

test("defineConfig сохраняет точные литеральные типы", () => {
  const config = defineConfig({ mode: "dark", retries: 3 });
  const mode: "dark" = config.mode;
  const retries: 3 = config.retries;
  // @ts-expect-error
  const wrong: "light" = config.mode;
});
