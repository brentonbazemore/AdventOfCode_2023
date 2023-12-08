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

// const ends = Object.keys(nodes).filter((node) => node[2] === 'Z')
let currNodes = Object.keys(nodes).filter((node) => node[2] === 'A');
let takenSteps = 0;
console.log(currNodes);
const cycledNodes = new Set();
while (true) {
  currNodes.forEach(node => {
    if (node[2] === 'Z') {
      cycledNodes.add(node);
      console.log(node, takenSteps);
      if (cycledNodes.size === currNodes.length) {
        throw 'hi';
        // at this point, I just manually found lcm for quickness. I added it officially in p2.5
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