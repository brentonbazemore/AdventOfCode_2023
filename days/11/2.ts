import '../../types/helper.d.ts';
import 'lodash.combinations';
import * as _ from 'lodash';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const display = (grid: string[]) => {
  for (let y = 0; y < grid.length; y++) {
    let row = '';
    for (let x = 0; x < grid[0].length; x++) {
      row += grid[y][x];
    }
    console.log(row);
  }
}

const expanded1: string[] = [];
data.forEach(line => {
  expanded1.push(line);
  if (!line.includes('#')) {
    expanded1.push(line);
  }
});

const rotated = _.unzip(expanded1.map(line => line.split(''))).map(line => line.join(''));

const expanded2: string[] = [];
rotated.forEach(line => {
  expanded2.push(line);
  if (!line.includes('#')) {
    expanded2.push(line);
  }
});

const rotated2 = _.unzip(expanded2.map(line => line.split(''))).map(line => line.join(''));
const universe = rotated2;

type Coords = `${number}_${number}`;
const galaxies = new Set<Coords>();
for (let y = 0; y < universe.length; y++) {
  for (let x = 0; x < universe[0].length; x++) {
    if (universe[y][x] === '#') {
      galaxies.add(`${x}_${y}`);
    }
  }
}

// console.log(galaxies);

const galaxyPairs = _.combinations(Array.from(galaxies), 2);

// const graph: { [coords: Coords]: number} = {};
let sum = 0;
galaxyPairs.forEach(([a, b]) => {
  const [ax, ay] = a.split('_').map(Number);
  const [bx, by] = b.split('_').map(Number);

  const distance = Math.abs(ax - bx) + Math.abs(ay - by);
  sum += distance;
})

console.log(sum);