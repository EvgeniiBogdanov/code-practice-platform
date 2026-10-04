// 1. createMachine принимает список состояний и начальное состояние.
//    Тип состояния должен выводиться из переданного массива
//    как объединение литералов ("idle" | "loading" | ...),
//    без as const на стороне вызова.
// 2. initial должен проверяться по списку states, а не расширять его:
//    опечатка в initial должна быть ошибкой, а не новым состоянием.
// 3. defineConfig должна возвращать объект с точными литеральными
//    типами значений, тоже без as const на стороне вызова.

const createMachine = (states, initial) => {
  let current = initial;

  return {
    getState: () => current,
    transition: (next) => {
      if (states.includes(next)) {
        current = next;
      }
    },
  };
};

const machine = createMachine(["idle", "loading", "success", "error"], "idle");
machine.transition("loading");
machine.transition("done"); // должно быть ошибкой
createMachine(["idle", "loading"], "idel"); // должно быть ошибкой

const defineConfig = (config) => config;

const config = defineConfig({ mode: "dark", retries: 3 });
// config.mode должен иметь тип "dark", config.retries — тип 3
