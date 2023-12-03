import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const symbols = new Set();
data.forEach(line => {
  let clean = line.replaceAll(/\d/g, '');
  clean = clean.replaceAll('.', '');
  clean.split('').forEach((char) => symbols.add(char));
});

const isDigit = new RegExp(/\d/);

const getFullNumber = (row: number, column: number) => {
  let columns = `${column}`
  let numString = data[row][column];
  for (let i = 1; i < 3; i++) {
    if (isDigit.test(data[row][column + i] ?? '')) {
      numString += data[row][column + i];
      columns += `_${column + i}`;
    } else {
      break;
    }
  }

  for (let i = 1; i < 3; i++) {
    if (isDigit.test(data[row][column - i] ?? '')) {
      numString = data[row][column - i] + numString;
      columns = `${column - i}_${columns}`;
    } else {
      break;
    }
  }

  return { numString, coords: `${row}:${columns}` };
};

const seenCoords = new Set();
const partNums: number[] = [];

for (let i = 0; i < data.length; i++) {
  const row = data[i];
  for (let j = 0; j < row.length; j++) {
    const cell = row[j];

    if (symbols.has(cell)) {
      for (let k = -1; k <= 1; k++) { // row square
        for (let l = -1; l <= 1; l++) { // column square
          if (isDigit.test(data[i + k][j + l])) {
            const { numString, coords } = getFullNumber(i + k, j + l);
            if (!seenCoords.has(coords)) {
              partNums.push(+numString);
            }
            seenCoords.add(coords);
          }
        }
      }
    }
  }
}

let sum = 0;
partNums.forEach(num => sum += num);

console.log(sum);