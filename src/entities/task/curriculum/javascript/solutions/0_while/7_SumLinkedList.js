const sumLinkedList = (head) => {
  let sum = 0;
  let current = head;

  while (current !== null) {
    sum += current.value;
    current = current.next;
  }

  return sum;
};

const list = {
  value: 10,
  next: {
    value: 20,
    next: {
      value: 30,
      next: null,
    },
  },
};

// Пример вызова:
console.log(sumLinkedList(list)); // 60
console.log(sumLinkedList(null)); // 0
