const sumLinkedList = (head) => {
  if (head === null) return 0;
  return head.value + sumLinkedList(head.next);
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
