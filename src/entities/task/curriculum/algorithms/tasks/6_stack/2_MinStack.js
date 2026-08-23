// Спроектируйте функцию-фабрику createMinStack(), которая создает и возвращает
// объект структуры данных "Стек" с поддержкой получения минимального элемента за O(1).
//
// Возвращаемый объект должен содержать следующие методы:
// - push(val) — добавляет элемент val на вершину стека.
// - pop() — удаляет элемент с вершины стека.
// - top() — возвращает элемент, находящийся на вершине стека, не удаляя его.
// - getMin() — возвращает минимальный элемент, находящийся в стеке.
//
// Главное условие:
// Все методы (push, pop, top, getMin) должны выполняться за время O(1).
//
// Примеры:
// const minStack = createMinStack();
// minStack.push(-2);
// minStack.push(0);
// minStack.push(-3);
// minStack.getMin(); // -3
// minStack.pop();
// minStack.top();    // 0
// minStack.getMin(); // -2

const createMinStack = () => {
  // Решение тут
};

// Пример вызова:
const minStack = createMinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log(minStack.getMin()); // -3
minStack.pop();
console.log(minStack.top());    // 0
console.log(minStack.getMin()); // -2
