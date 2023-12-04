import '../../types/helper.d.ts';
import * as _ from 'lodash';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

let sum = 0;
data.forEach(line => {
  const [rawCard, rawAllNums] = line.split(': ');
  const [rawWinningNums, rawMyNums] = rawAllNums.split(' | ');
  const winningNums = rawWinningNums.replaceAll('  ', ' ').split(' ').map(Number);
  const myNums = rawMyNums.replaceAll('  ', ' ').split(' ').map(Number);

  sum += Math.floor(Math.pow(2, _.intersection(winningNums, myNums).length - 1));
});
console.log(sum);