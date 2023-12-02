import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

let sum = 0;
lines: for (let i = 0; i < data.length; i++) {
  const line = data[i];
  const [rawGameId, rawGame] = line.split(': ');
  const gameNum = +rawGameId.split('Game ')[1];
  const rawSets = rawGame.split('; ');
  const allValid = rawSets.every(rawSet => {
    const rawCubes = rawSet.split(', ');
    const cubes = rawCubes.map(rawCube => {
      const [count, color] = rawCube.split(' ');
      return {
        count: +count,
        color,
      }
    });

    const valid = cubes.every(cube => {
      if (cube.color === 'red' && cube.count > 12) {
        return false;
      }

      if (cube.color === 'green' && cube.count > 13) {
        return false;
      }

      if (cube.color === 'blue' && cube.count > 14) {
        return false;
      }

      return true;
    });

    return valid;

    // console.log(valid);

    // console.log(cubes);
  });

  if (allValid) {
    sum += gameNum;
  }
};

console.log(sum);
