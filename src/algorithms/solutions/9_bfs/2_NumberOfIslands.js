const numIslands = (grid) => {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  const bfs = (startRow, startCol) => {
    const queue = [[startRow, startCol]];
    grid[startRow][startCol] = '0';

    while (queue.length > 0) {
      const [row, col] = queue.shift();
      const neighbors = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ];

      for (const [r, c] of neighbors) {
        const inBounds = r >= 0 && r < rows && c >= 0 && c < cols;
        if (inBounds && grid[r][c] === '1') {
          grid[r][c] = '0';
          queue.push([r, c]);
        }
      }
    }
  };

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (grid[row][col] === '1') {
        count += 1;
        bfs(row, col);
      }
    }
  }

  return count;
};

// Пример вызова:
const grid1 = [
  ['1', '1', '1', '1', '0'],
  ['1', '1', '0', '1', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '0', '0', '0'],
];
console.log(numIslands(grid1)); // 1

const grid2 = [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '1', '0', '0'],
  ['0', '0', '0', '1', '1'],
];
console.log(numIslands(grid2)); // 3
