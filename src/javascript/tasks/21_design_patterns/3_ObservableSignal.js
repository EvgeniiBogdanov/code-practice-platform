// Реактивность (Observable / Signal)
// Реализуйте функцию createSignal(initialValue), возвращающую кортеж [get, set].
// - get(): возвращает текущее значение и подписывает текущую контекстную функцию (если она есть).
// - set(newValue): обновляет значение и уведомляет всех подписчиков.
// Дополнительно реализуйте функцию effect(fn), которая выполняет fn и регистрирует ее как контекстную.

const createSignal = (initialValue) => {
  // Ваш код здесь
};

let currentEffect = null;

const effect = (fn) => {
  // Ваш код здесь
};

const [count, setCount] = createSignal(0);

effect(() => {
  console.log("Count changed:", count());
});
// Выведет: Count changed: 0

setCount(1); // Выведет: Count changed: 1
setCount(2); // Выведет: Count changed: 2
