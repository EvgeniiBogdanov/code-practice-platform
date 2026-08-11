const sumLinkedList = (head) => {
  if (!head) return 0;
  return head.value + sumLinkedList(head.next);
};
