// Напишите функцию-фабрику createMinStack(), которая возвращает стек с методами:
// - push(val) — положить val на вершину;
// - pop() — снять элемент с вершины;
// - top() — вернуть элемент на вершине, не снимая его;
// - getMin() — вернуть наименьший элемент среди лежащих в стеке.
//
// Все четыре метода должны работать за O(1). Методы pop, top и getMin
// не вызываются на пустом стеке.

const createMinStack = () => {
  // Решение тут
};

// Пример вызова:
const stack = createMinStack();
stack.push(5);
stack.push(2);
stack.push(7);
console.log(stack.getMin()); // 2
stack.pop();
console.log(stack.top());    // 2
stack.pop();
console.log(stack.getMin()); // 5
