// Что выведет данный код в консоль и почему?

const state = {
  user: { name: "Alice", preferences: { theme: "dark" } },
  version: 1,
};

const nextState = {
  ...state,
  version: 2,
};

nextState.user.preferences.theme = "light";

console.log(state.user.preferences.theme);
console.log(nextState.user.preferences.theme);
