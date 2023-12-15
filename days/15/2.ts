import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split(',');

// which box
const hash = (inst: string) => {
  let value = 0;
  for (let i = 0; i < inst.length; i++) {
    value += inst.charCodeAt(i);
    value *= 17;
    value %= 256;
  }
  return value;
}

// rn=1
// rn = whicih lens
// 1 = focal length

// - means remove
// = means 

const boxes: { id: string, focal: number }[][] = [];
for (let i = 0; i < 256; i++) {
  boxes[i] = [];
}

data.forEach(inst => {
  if (inst.includes('-')) {
    const [lensId,] = inst.split('-');
    const boxId = hash(lensId);
    // console.log(lensId, boxId)
    const lensPos = boxes[boxId].findIndex(lens => lens.id === lensId);
    if (lensPos === -1) {
      // do nothing
    } else {
      boxes[boxId].splice(lensPos, 1);
    }
  }
  
  if (inst.includes('=')) {
    const [lensId, focal] = inst.split('=');
    const boxId = hash(lensId);
    // console.log(lensId, boxId)
    const lensPos = boxes[boxId].findIndex(lens => lens.id === lensId);
    if (lensPos === -1) {
      boxes[boxId].push({ id: lensId, focal: +focal });
    } else {
      boxes[boxId][lensPos] = { id: lensId, focal: +focal };
    }
  }
})

let power = 0;
boxes.forEach((box, i) => {
  if (box.length === 0) {
    return;
  }
  const localPower = i + 1;
  box.forEach((lens, j) => {
    const slotNumber = j + 1;
    const focalPower = localPower * lens.focal * slotNumber;
    power += focalPower;
    // console.log(`${lens.id}: ${localPower} (box ${i}) * ${slotNumber} (slot) * ${lens.focal} (focal length) = ${focalPower}`)
  });
})

console.log(power);