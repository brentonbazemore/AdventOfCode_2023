import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

let sum = 0;
data.forEach(line => {
  const [rawGameId, rawGame] = line.split(': ');
  const gameNum = +rawGameId.split('Game ')[1];
  const rawSets = rawGame.split('; ');

  const maxCubes = {
    red: 0,
    green: 0,
    blue: 0,
  };

  rawSets.forEach((rawSet) => {
    const rawCubes = rawSet.split(', ');
    rawCubes.forEach((rawCube) => {
      const [count, color] = rawCube.split(' ') as [number, 'red' | 'green' | 'blue'];
      maxCubes[color] = Math.max(maxCubes[color], count);
    });
  });

  sum += maxCubes.red * maxCubes.green * maxCubes.blue;
});

console.log(sum);
