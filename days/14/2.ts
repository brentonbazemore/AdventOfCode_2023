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

const tickNorth = () => {
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

const tickSouth = () => {
  let didMove = false;
  const newPlateState = JSON.parse(JSON.stringify(plate));
  // console.log(newPlateState);
  for (let y = 0; y < newPlateState.length; y++) {
    for (let x = 0; x < newPlateState[0].length; x++) {
      const cell = plate[y][x];
      // console.log(cell);
      if (cell === 'O') {
        if (plate[y + 1]?.[x] === '.') {
          newPlateState[y + 1][x] = 'O';
          newPlateState[y][x] = '.';
          didMove = true;
        }
      }
    }
  }

  plate = newPlateState;

  return didMove;
}

const tickWest = () => {
  let didMove = false;
  const newPlateState = JSON.parse(JSON.stringify(plate));
  // console.log(newPlateState);
  for (let y = 0; y < newPlateState.length; y++) {
    for (let x = 0; x < newPlateState[0].length; x++) {
      const cell = plate[y][x];
      // console.log(cell);
      if (cell === 'O') {
        if (plate[y][x - 1] === '.') {
          newPlateState[y][x - 1] = 'O';
          newPlateState[y][x] = '.';
          didMove = true;
        }
      }
    }
  }

  plate = newPlateState;

  return didMove;
}

const tickEast = () => {
  let didMove = false;
  const newPlateState = JSON.parse(JSON.stringify(plate));
  // console.log(newPlateState);
  for (let y = 0; y < newPlateState.length; y++) {
    for (let x = 0; x < newPlateState[0].length; x++) {
      const cell = plate[y][x];
      // console.log(cell);
      if (cell === 'O') {
        if (plate[y][x + 1] === '.') {
          newPlateState[y][x + 1] = 'O';
          newPlateState[y][x] = '.';
          didMove = true;
        }
      }
    }
  }

  plate = newPlateState;

  return didMove;
}

const tiltNorth = () => {
  let someMoved = true;
  while (someMoved) {
    // console.log('tick');
    someMoved = tickNorth();
  }
}

const tiltSouth = () => {
  let someMoved = true;
  while (someMoved) {
    someMoved = tickSouth();
  }
}

const tiltWest = () => {
  let someMoved = true;
  while (someMoved) {
    someMoved = tickWest();
  }
}

const tiltEast = () => {
  let someMoved = true;
  while (someMoved) {
    someMoved = tickEast();
  }
}

let cycleStart;
let cycleSize;
let seen = new Map<string, number>();
const target = 1000000000;
for (let i = 0; i < target; i++) {
  tiltNorth();
  tiltWest();
  tiltSouth();
  tiltEast();
  if (seen.has(plate.join(''))) {
    cycleStart = seen.get(plate.join(''))!;
    cycleSize = i - seen.get(plate.join(''))!;
    console.log('dupe happened on', i, 'for', seen.get(plate.join('')));
    break;
  }
  seen.set(plate.join(''), i);
}

const remainder = (target - cycleStart!) % cycleSize!;
for (let i = 0; i < remainder - 1; i++) {
  tiltNorth();
  tiltWest();
  tiltSouth();
  tiltEast();
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
console.log(sum);


// console.log(seen);
// console.log(plate.map(l => l.join('')).join('\n'));