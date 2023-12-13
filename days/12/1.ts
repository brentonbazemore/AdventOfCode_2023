import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const displayReplacement = (str: string, index: number, replacement: number, symbol: string = '_') => {
  let fill = symbol;
  for (let i = 1; i < replacement + 1; i++) {
    fill += '#';
  }
  fill += symbol;
  return str.substring(0, index) + fill + str.substring(index + fill.length);
}

const displayMatch = (seen: string, original: string) => {
  let str = original;
  const [, ...indices] = seen.split('_').map(s => {
    const [index, matchLength, groupSize] = s.split(':');
    str = displayReplacement(str, +index, +matchLength)
    return { index, matchLength, groupSize}
  });
  console.log(original);
  console.log(str);
  
}

const doubleCheck = (seen: string, original: string, groups: number[]) => {
  let str = original;
  seen.split('_').forEach(s => {
    const [index, matchLength, groupSize] = s.split(':');
    str = displayReplacement(str, +index, +matchLength, '.');
  });
  let groupSum = 0;
  for (let i = 0; i < groups.length; i++) {
    groupSum += groups[i];
  }
  return str.replaceAll(/[^#]/g, '').length === groupSum;

  // try putting this  back too if needed
  // let raw = '';
  // groups.forEach(groupSize => {
  //   raw += `[^#]+[#?]{${groupSize}}`;
  // })
  // raw += '[^#]+';
  // // console.log(raw);
  // return new RegExp(raw).test(str);
}

const findValid = (record: string, groups: number[], seenArrangements: Set<string>, selected: string, original: string, originalGroups: number[]) => {
  // console.log(new Array(original.length - record.length).fill(' ').join('') + record);
  if (groups.length === 0) {
    if (!seenArrangements.has(selected)) {
      seenArrangements.add(selected);
      const isValid = doubleCheck(selected, original, originalGroups);
      if (isValid) {
        displayMatch(selected, original);
        return 1;
      }
      // console.log('+1', nextSelected);
    }

    seenArrangements.add(selected)
  }
  // console.log(record, groups[0]);


  let amount = 0;
  const nextGroups = groups.slice(1);
  const nextGroupSize = groups[0];
  const groupRegex = new RegExp(`[^#][#?]{${nextGroupSize}}[^#]`);
  // optimization: don't start at 0, start at index of first match, then iterate from there
  const nextHash = record.indexOf('#');
  let searchRange = record.length - nextGroupSize;
  if (nextHash !== -1) {
    searchRange = Math.min(searchRange, nextHash);
  }
  for (let i = 0; i < searchRange; i++) {
    const shiftedString = record.substring(i);
    const matches = groupRegex.exec(shiftedString);
    if (matches) {
      const matchedString = matches[0];
      const localIndex = matches.index;
      const globalIndex = original.length - shiftedString.length;
      const nextSelected = selected + `_${globalIndex + localIndex}:${nextGroupSize}`;

      const nextRecord = '.' + shiftedString.substring(localIndex + matchedString.length);
      amount += findValid(nextRecord, nextGroups, seenArrangements, nextSelected, original, originalGroups);
    }
  }

  return amount;
}

let sum = 0;
const out = data.map(line => {
  const seenArrangements = new Set<string>();
  const [record, rawGroups] = line.split(' ');
  const groups = rawGroups.split(',').map(Number);
  console.error(line)
  const amount = findValid(`.${record}.`, groups, seenArrangements, '', `.${record}.`, groups);
  console.log(amount);
  console.log('\n');
  sum += amount;
  return amount;
});
const outFile = Bun.file('check1.txt');
const writer = outFile.writer();
for (let i = 0; i < out.length; i++) {
  writer.write(`${out[i]}\n`);
}
writer.end();

console.log(sum);
