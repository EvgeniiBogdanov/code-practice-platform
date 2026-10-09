/**
 * Data Structure and Algorithm Helpers for WebWorker Runtime
 */

export interface TreeNode {
  val: unknown;
  left: TreeNode | null;
  right: TreeNode | null;
}

export interface ListNode {
  val: unknown;
  next: ListNode | null;
}

export const sandboxHelpers = {
  createNode: (val = 0, left = null, right = null) => ({ val, left, right }),
  createTreeNode: (val = 0, left = null, right = null) => ({ val, left, right }),
  createListNode: (val = 0, next = null) => ({ val, next }),

  buildTree: (values: unknown[]): TreeNode | null => {
    if (!values || values.length === 0) return null;
    const root: TreeNode = { val: values[0], left: null, right: null };
    const queue: TreeNode[] = [root];
    let i = 1;
    while (i < values.length) {
      const current = queue.shift();
      if (!current) break;
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

  treeToArray: (root: TreeNode | null): unknown[] => {
    if (root === null) return [];
    const result: unknown[] = [];
    const queue: Array<TreeNode | null> = [root];
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

  createLinkedList: (arr: unknown[]): ListNode | null => {
    if (!arr || arr.length === 0) return null;
    return arr.reduceRight<ListNode | null>((next, val) => ({ val, next }), null);
  },

  linkedListToArray: (head: ListNode | null): unknown[] => {
    const res: unknown[] = [];
    const visited = new Set<ListNode>();
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

  printLinkedList: (head: ListNode | null): unknown[] => {
    const res: unknown[] = [];
    let curr = head;
    while (curr) {
      res.push(curr.val);
      curr = curr.next;
    }
    return res;
  },

  createLinkedListWithCycle: (arr: unknown[], pos: number): ListNode | null => {
    if (!arr || arr.length === 0) return null;
    const nodes: ListNode[] = arr.map((val) => ({ val, next: null }));
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].next = nodes[i + 1];
    }
    if (pos >= 0 && pos < nodes.length) {
      nodes[nodes.length - 1].next = nodes[pos];
    }
    return nodes[0];
  },

  createListWithCycle: (arr: unknown[], pos: number): ListNode | null => {
    return sandboxHelpers.createLinkedListWithCycle(arr, pos);
  },

  buildList: (values: unknown[]): ListNode | null => {
    return sandboxHelpers.createLinkedList(values);
  },

  listToArray: (head: ListNode | null): unknown[] => {
    return sandboxHelpers.linkedListToArray(head);
  },

  cloneDeep: <T>(val: T): T => {
    try {
      return structuredClone(val);
    } catch {
      return JSON.parse(JSON.stringify(val));
    }
  },
};
