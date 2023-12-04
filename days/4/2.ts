import '../../types/helper.d.ts';
import * as _ from 'lodash';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

// keep track of how many of each card there is and multiply each result by that number;

const cardCount: { [cardNum: number]: number } = {};
for (let i = 0; i < data.length; i++) {
  cardCount[i + 1] = 1;
}

data.forEach(line => {
  const [rawCard, rawAllNums] = line.split(': ');
  const cardNum = +rawCard.replaceAll('   ', ' ').replaceAll('  ', ' ').split(' ')[1]

  const currentCardInstanceCount = cardCount[cardNum];

  const [rawWinningNums, rawMyNums] = rawAllNums.split(' | ');
  const winningNums = rawWinningNums.replaceAll('  ', ' ').split(' ').map(Number);
  const myNums = rawMyNums.replaceAll('  ', ' ').split(' ').map(Number);
  const winCount = _.intersection(winningNums, myNums).length;

  for (let i = 0; i < winCount; i++) {
    cardCount[cardNum + 1 + i] = (cardCount[cardNum + 1 + i] ?? 0) + currentCardInstanceCount;
  }
});

let sum = 0;
Object.typedKeys(cardCount).forEach(card => {
  sum += cardCount[card];
});
console.log(sum);