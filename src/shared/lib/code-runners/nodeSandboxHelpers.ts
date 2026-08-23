/**
 * Data Structure and Algorithm Helpers for WebWorker Runtime
 */

export const sandboxHelpers = {
  createNode: (val = 0, left = null, right = null) => ({ val, left, right }),
  createTreeNode: (val = 0, left = null, right = null) => ({ val, left, right }),
  createListNode: (val = 0, next = null) => ({ val, next }),

  buildTree: (values: any[]) => {
    if (!values || values.length === 0) return null;
    const root = { val: values[0], left: null as any, right: null as any };
    const queue = [root];
    let i = 1;
    while (i < values.length) {
      const current = queue.shift()!;
      const leftVal = values[i++];
      if (leftVal !== null && leftVal !== undefined) {
        current.left = { val: leftVal, left: null, right: null };
        queue.push(current.left);
      }
      if (i < values.length) {
        const rightVal = values[i++];
        if (rightVal !== null && rightVal !== undefined) {
          current.right = { val: rightVal, left: null, right: null };
          queue.push(current.right);
        }
      }
    }
    return root;
  },

  treeToArray: (root: any) => {
    if (root === null) return [];
    const result: any[] = [];
    const queue = [root];
    while (queue.length > 0) {
      const node = queue.shift();
      if (node) {
        result.push(node.val);
        queue.push(node.left);
        queue.push(node.right);
      } else {
        result.push(null);
      }
    }
    while (result.length > 0 && result[result.length - 1] === null) {
      result.pop();
    }
    return result;
  },

  createLinkedList: (arr: any[]) => {
    if (!arr || arr.length === 0) return null;
    return arr.reduceRight((acc, val) => ({ val, next: acc }), null);
  },

  linkedListToArray: (head: any) => {
    const res: any[] = [];
    const visited = new Set();
    let curr = head;
    while (curr) {
      if (visited.has(curr)) {
        res.push("[Cycle detected]");
        break;
      }
      visited.add(curr);
      res.push(curr.val);
      curr = curr.next;
    }
    return res;
  },

  printLinkedList: (head: any) => {
    const res: any[] = [];
    let curr = head;
    while (curr) {
      res.push(curr.val);
      curr = curr.next;
    }
    return res;
  },

  createLinkedListWithCycle: (arr: any[], pos: number) => {
    if (!arr || arr.length === 0) return null;
    const nodes = arr.map((val) => ({ val, next: null as any }));
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].next = nodes[i + 1];
    }
    if (pos >= 0 && pos < nodes.length) {
      nodes[nodes.length - 1].next = nodes[pos];
    }
    return nodes[0];
  },

  createListWithCycle: (arr: any[], pos: number) => {
    return sandboxHelpers.createLinkedListWithCycle(arr, pos);
  },

  buildList: (values: any[]) => {
    return sandboxHelpers.createLinkedList(values);
  },

  listToArray: (head: any) => {
    return sandboxHelpers.linkedListToArray(head);
  },

  cloneDeep: (val: any) => {
    try {
      return structuredClone(val);
    } catch {
      return JSON.parse(JSON.stringify(val));
    }
  },
};
