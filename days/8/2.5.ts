import '../../types/helper.d.ts';
import * as MathUtils from '../../utils/MathUtils.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const instructions = data[0];

const nodes: { [node: string]: { L: string, R: string }} = {};
for (let i = 2; i < data.length; i++) {
  const line = data[i];
  const [node, rawLR] = line.split(' = ');
  const [rawL, rawR] = rawLR.split(', ')
  const L = rawL.replace('(', '');
  const R = rawR.replace(')', '');
  nodes[node] = { L, R };
}

let currNodes = Object.keys(nodes).filter((node) => node[2] === 'A');
let takenSteps = 0;
console.log(currNodes);
const cycles: { [node: string]: number } = {};
while (true) {
  currNodes.forEach(node => {
    if (node[2] === 'Z') {
      if (!cycles[node]) {
        cycles[node] = takenSteps;
      }
      console.log(node, takenSteps);
      if (Object.keys(cycles).length === currNodes.length) {
        throw MathUtils.lcm(Object.values(cycles));
      }
    }
  })
  if (currNodes.every(node => node[2] === 'Z')) {
    break;
  }

  const inst = instructions[takenSteps % instructions.length];
  currNodes = currNodes.map(currNode => nodes[currNode][inst as 'L' | 'R']);
  takenSteps++;

  if (takenSteps % 1000000 === 0) {
    console.log('Step', takenSteps);
  }
}

console.log(takenSteps);