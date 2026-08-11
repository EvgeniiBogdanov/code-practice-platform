const sumLinkedList = (head) => {
  let sum = 0;
  let current = head;

  while (current !== null) {
    sum += current.value;
    current = current.next;
  }

  return sum;
};
