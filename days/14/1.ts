import '../../types/helper.d.ts';
import * as _ from 'lodash';
import * as ArrayUtils from '../../utils/ArrayUtils.ts';
import * as MathUtils from '../../utils/MathUtils.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

let plate: string[][] = [];
data.forEach(line => {
  plate.push(line.split(''));
});

const tick = () => {
  let didMove = false;
  const newPlateState = JSON.parse(JSON.stringify(plate));
  // console.log(newPlateState);
  for (let y = 0; y < newPlateState.length; y++) {
    for (let x = 0; x < newPlateState[0].length; x++) {
      const cell = plate[y][x];
      // console.log(cell);
      if (cell === 'O') {
        if (plate[y - 1]?.[x] === '.') {
          newPlateState[y - 1][x] = 'O';
          newPlateState[y][x] = '.';
          didMove = true;
        }
      }
    }
  }

  plate = newPlateState;

  return didMove;
}

let someMoved = true;
while (someMoved) {
  // console.log('tick');
  someMoved = tick();
}

let sum = 0;
for (let y = 0; y < plate.length; y++) {
  for (let x = 0; x < plate[0].length; x++) {
    const cell = plate[y][x];
    if (cell === 'O') {
      sum += plate.length - y
    }
  }
}

console.log(plate.map(l => l.join('')).join('\n'));
console.log(sum);