const createMinStack = () => {
  const stack = [];
  const minStack = [];

  const push = (value) => {
    stack.push(value);
    const currentMin = minStack.length ? Math.min(value, minStack[minStack.length - 1]) : value;
    minStack.push(currentMin);
  };

  const pop = () => {
    stack.pop();
    minStack.pop();
  };

  const top = () => stack[stack.length - 1];

  const getMin = () => minStack[minStack.length - 1];

  return { push, pop, top, getMin };
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
