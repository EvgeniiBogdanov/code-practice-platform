interface Machine<S extends string> {
  getState: () => S;
  transition: (next: S) => void;
}

// Ограничение string сохраняет литералы, NoInfer исключает initial из вывода S.
const createMachine = <S extends string>(
  states: readonly S[],
  initial: NoInfer<S>
): Machine<S> => {
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
// machine.transition("done") и createMachine([...], "idel") — ошибки типов (проверяются в tests.ts)

// const-параметр выводит тип аргумента так, будто вызов записан с as const.
const defineConfig = <const T extends object>(config: T): T => config;

const config = defineConfig({ mode: "dark", retries: 3 });
// config: { readonly mode: "dark"; readonly retries: 3 }
