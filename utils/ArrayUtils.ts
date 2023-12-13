export const rotate = (matrix: any[][]) => matrix[0].map((val, index) => matrix.map((row) => row[index]).reverse());

export const rotateLeft = (matrix: any[][]) => matrix[0].map((val, index) => matrix.map((row) => row[row.length - 1 - index]));
