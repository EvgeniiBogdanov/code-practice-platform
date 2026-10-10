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
const stack = createMinStack();
stack.push(5);
stack.push(2);
stack.push(7);
console.log(stack.getMin()); // 2
stack.pop();
console.log(stack.top());    // 2
stack.pop();
console.log(stack.getMin()); // 5
