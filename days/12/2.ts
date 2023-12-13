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
  seen.split('_').forEach(s => {
    const [index, matchLength, groupSize] = s.split(':');
    str = displayReplacement(str, +index, +matchLength)
    return { index, matchLength, groupSize}
  });
  // console.log(original);
  console.log(str);
  
}

const doubleCheck = (seen: string, original: string, groups: number[]) => {
  let str = original;
  seen.split('_').forEach(s => {
    const [index, matchLength] = s.split(':');
    str = displayReplacement(str, +index, +matchLength, '.');
  });
  let groupSum = 0;
  for (let i = 0; i < groups.length; i++) {
    groupSum += groups[i];
  }
  
  return str.replaceAll(/[^#]/g, '').length === groupSum;
}

// const findValid = (record: string, groups: number[], selected: string, original: string, originalGroups: number[], cache: Map<string, number>) => {
//   // console.log(record.padStart(original.length, ' '));
//   const cacheKey = `${record}:${groups}`;
//   if (cache.has(cacheKey)) {
//     return cache.get(cacheKey)!;
//   }
//   if (groups.length === 0 && record.indexOf('#') === -1) {
//     if (!doubleCheck(selected, original, originalGroups)) {
//       displayMatch(selected, original);
//       console.error('invalid');
//     }
//     return 1;
//     // // need to not rely on this
//     // if (doubleCheck(selected, original, originalGroups)) {
//     //   // displayMatch(selected, original);
//     // } else {
//     //   console.error('invalid');
//     //   displayMatch(selected, original);
//     //   return 0;
//     // }
//   }

//   let amount = 0;
//   const nextGroups = groups.slice(1);
//   const nextGroupSize = groups[0];
//   const groupRegex = new RegExp(`[^#][#?]{${nextGroupSize}}[^#]`);
//   const nextHash = record.indexOf('#');
//   let searchRange = record.length - nextGroupSize;
//   if (nextHash !== -1) {
//     searchRange = Math.min(searchRange, nextHash);
//   }

//   const first = groupRegex.exec(record);
//   if (!first) {
//     cache.set(cacheKey, amount);
//     return amount;
//   }

//   // figure out why some of them are skipping #'s
//   // figure out why t3 isn't using cache properly but everything else is

//   const prev = new Set<string>();
//   // this is shifting the window too far over and introducing duplicate matches ;-;
//   for (let i = first.index; i < searchRange; i++) {
//     const prevString = record.substring(0, i);
//     if (prevString.includes('#')) {
//       break;
//     }
//     const shiftedString = record.substring(i);
//     const matches = groupRegex.exec(shiftedString);
//     if (matches) {
//       const matchedString = matches[0];
//       const localIndex = matches.index;
//       const globalIndex = original.length - shiftedString.length;
//       const nextSelected = selected + `_${globalIndex + localIndex}:${nextGroupSize}`;

//       const nextRecord = '.' + shiftedString.substring(localIndex + matchedString.length);
//       if (prev.has(nextRecord)) {
//         continue;
//       }
//       // if (groups.length === 5) {
//       //   console.log('doin it');
//       // }
//       prev.add(nextRecord);
//       const partial = findValid(nextRecord, nextGroups, nextSelected, original, originalGroups, cache);
//       // if (groups.length === 5) {
//         console.log(record.padStart(original.length, ' '), amount, '+', partial, nextRecord, nextGroups);
//       // }
//       // cache.set(nextRecord, partial);
//       amount += partial;  
//     }
//   }
//   // displayMatch(selected, original);
//   // console.log(amount, record, groups)
//   // console.log('^', amount);
//   // console.log({record, amount});

//   cache.set(cacheKey, amount);
//   // console.log(cache);
//   return amount;
// }

let cache = new Map<string, number>();
const findValid = (record: string, groups: number[]) => {
  // console.log(record);
  const cacheKey = `${record}:${groups}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  if (groups.length === 0 && record.indexOf('#') === -1) {
    cache.set(cacheKey, 1);
    return 1;
  }

  let amount = 0;
  if (record[0] === '.') {
    amount = findValid(record.slice(1), groups);
  }
  
  const groupSize = groups[0];
  const groupRegex = new RegExp(`[#?]{${groupSize}}`);
  if (record[0] === '#') {
    const window = record.substring(0, groupSize);
    const remainder = record.substring(groupSize);
    const isValidGroup = groupRegex.test(window);
    const validNeighbor = remainder[0] !== '#';
    if (isValidGroup && validNeighbor) {
      amount = findValid(remainder.slice(1), groups.slice(1));
    }
  }

  if (record[0] === '?') {
    amount += findValid(record.slice(1), groups); // if .
    const window = record.substring(0, groupSize);
    const remainder = record.substring(groupSize);
    const isValidGroup = groupRegex.test(window);
    const validNeighbor = remainder[0] !== '#';
    if (isValidGroup && validNeighbor) {
      amount += findValid(remainder.slice(1), groups.slice(1)); // if #
    }
  }

  cache.set(cacheKey, amount);
  return amount;
}

let sum = 0;
data.forEach((line, i) => {
  // console.log('Line', i);
  const [record, rawGroups] = line.split(' ');
  const groups = rawGroups.split(',').map(Number);
  let unfoldedRecord = record;
  const unfoldedGroups = [...groups];
  for (let i = 0; i < 4; i++) {
    unfoldedRecord += '?' + record;
    unfoldedGroups.push(...groups);
  }
  // console.error(' ' + unfoldedRecord)
  // const cache = new Map();
  cache = new Map();
  const amount = findValid(unfoldedRecord, unfoldedGroups);
  // console.log(amount);
  // console.log('');
  // console.log(cache.size)
  sum += amount;
});

// const out = data.map(line => {
//   const [record, rawGroups] = line.split(' ');
//   const groups = rawGroups.split(',').map(Number);
//   console.error(' ' + line)
//   cache = new Map();
//   const amount = findValid(record, groups);
//   console.log(cache);
//   console.log(amount);
//   console.log('');
//   sum += amount;
//   return amount;
// });

// const outFile = Bun.file('check2.txt');
// const writer = outFile.writer();
// for (let i = 0; i < out.length; i++) {
//   writer.write(`${out[i]}\n`);
// }
// writer.end();

console.log(sum);
