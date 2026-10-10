// Вспомогательные функции — не часть задачи.
// Они собирают связный список из массива и превращают его обратно в массив,
// чтобы решение можно было запустить и сверить с примерами.

const createNode = (val = 0, next = null) => ({ val, next });
const createListNode = createNode;

// Строит связный список из массива чисел
const createLinkedList = (arr) => {
  if (!arr || arr.length === 0) return null;
  return arr.reduceRight((acc, val) => createNode(val, acc), null);
};

// Превращает связный список обратно в массив для удобной сверки в console.log
const linkedListToArray = (head) => {
  const result = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
};

const printLinkedList = linkedListToArray;

// Создает связный список с циклом (pos — индекс узла, на который замыкается хвост, или -1)
const createLinkedListWithCycle = (arr, pos) => {
  if (!arr || arr.length === 0) return null;

  const nodes = arr.map((val) => createNode(val));
  nodes.forEach((node, index) => {
    if (index < nodes.length - 1) {
      node.next = nodes[index + 1];
    }
  });

  if (pos >= 0 && pos < nodes.length) {
    nodes[nodes.length - 1].next = nodes[pos];
  }

  return nodes[0];
};

const createListWithCycle = createLinkedListWithCycle;

module.exports = {
  createNode,
  createListNode,
  createLinkedList,
  linkedListToArray,
  printLinkedList,
  createLinkedListWithCycle,
  createListWithCycle,
};
