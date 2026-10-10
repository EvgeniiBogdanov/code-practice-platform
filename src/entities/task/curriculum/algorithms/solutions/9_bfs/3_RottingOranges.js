const orangesRotting = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] === 2) {
        queue.push([r, c]);
      }
      if (grid[r][c] === 1) {
        freshCount += 1;
      }
    }
  }

  let minutes = 0;

  while (queue.length > 0 && freshCount > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i += 1) {
      const [row, col] = queue.shift();
      const neighbors = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ];

      for (const [r, c] of neighbors) {
        const inBounds = r >= 0 && r < rows && c >= 0 && c < cols;
        if (inBounds && grid[r][c] === 1) {
          grid[r][c] = 2;
          freshCount -= 1;
          queue.push([r, c]);
        }
      }
    }

    minutes += 1;
  }

  if (freshCount > 0) {
    return -1;
  }

  return minutes;
};

// Пример вызова:
const box1 = [
  [2, 1, 0],
  [1, 1, 1],
  [0, 0, 1],
];
console.log(orangesRotting(box1)); // 4

const box2 = [
  [2, 0, 1],
  [1, 0, 1],
];
console.log(orangesRotting(box2)); // -1

const box3 = [[0, 0, 0]];
console.log(orangesRotting(box3)); // 0
