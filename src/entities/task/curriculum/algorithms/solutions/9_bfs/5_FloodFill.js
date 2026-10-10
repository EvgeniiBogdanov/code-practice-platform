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
const image1 = [
  [0, 0, 1],
  [0, 1, 1],
  [1, 1, 0],
];
console.log(floodFill(image1, 2, 1, 5)); // [[0, 0, 5], [0, 5, 5], [5, 5, 0]]

const image2 = [
  [3, 3],
  [3, 3],
];
console.log(floodFill(image2, 0, 0, 3)); // [[3, 3], [3, 3]]
