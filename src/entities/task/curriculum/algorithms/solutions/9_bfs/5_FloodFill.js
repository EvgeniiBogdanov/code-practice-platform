const floodFill = (image, sr, sc, color) => {
  const sourceColor = image[sr][sc];

  if (sourceColor === color) {
    return image;
  }

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue = [[sr, sc]];
  let head = 0;
  image[sr][sc] = color;

  while (head < queue.length) {
    const [row, column] = queue[head];
    head++;

    for (const [rowOffset, columnOffset] of directions) {
      const nextRow = row + rowOffset;
      const nextColumn = column + columnOffset;
      const isInside =
        nextRow >= 0 &&
        nextRow < image.length &&
        nextColumn >= 0 &&
        nextColumn < image[0].length;

      if (isInside && image[nextRow][nextColumn] === sourceColor) {
        image[nextRow][nextColumn] = color;
        queue.push([nextRow, nextColumn]);
      }
    }
  }

  return image;
};

// Пример вызова:
console.log(
  floodFill(
    [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1],
    ],
    1,
    1,
    2
  )
); // [[2, 2, 2], [2, 2, 0], [2, 0, 1]]

console.log(floodFill([[0, 0, 0]], 0, 0, 0)); // [[0, 0, 0]]
