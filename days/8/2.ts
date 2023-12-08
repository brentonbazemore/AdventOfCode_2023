import '../../types/helper.d.ts';

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

let currNode = 'AAA';
let takenSteps = 0;
while (true) {
  if (currNode === 'ZZZ') {
    break;
  }

  const inst = instructions[takenSteps % instructions.length];
  currNode = nodes[currNode][inst as 'L' | 'R'];
  takenSteps++;
}

console.log(takenSteps);