import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');


enum Direction {
  RIGHT = 'R',
  DOWN = 'D',
  LEFT = 'L',
  UP = 'U',
}

const num2enum: any = {
  0: Direction.RIGHT,
  1: Direction.DOWN,
  2: Direction.LEFT,
  3: Direction.UP
}


const instructions = data.map((line) => {
  const [,rawHex] = line.split('#');
  const cleanHex = rawHex.replace(')', '');
  const num = parseInt(cleanHex.substring(0, 5), 16);
  const direction = num2enum[+cleanHex.at(5)!] as Direction;
  return { direction, num }
})

// console.log(inst);

let position = { x: 0, y: 0 }

let perimeter = 0;
const corners: { x: number, y: number }[] = [{ x: position.x, y: position.y }];
instructions.forEach(({ direction, num: length }) => {
  if (direction === Direction.RIGHT) {
    position.x += length;
  }
  if (direction === Direction.LEFT) {
    position.x -= length;
  }
  if (direction === Direction.UP) {
    position.y -= length;
  }
  if (direction === Direction.DOWN) {
    position.y += length;
  }

  perimeter += length;
  // 1. Write down the coords of the vertices of the irregular polygon
  corners.push({ x: position.x, y: position.y });
});
corners.pop();

// 2. Create an array (in counter clockwise order)
// corners.reverse(); // not sure which way it goes...

// 3. Multiply the x coordinate of each vertex by the y coordinate of the next vertex.
// let step3 = 0;
let step5 = 0;
for (let i = 0; i < corners.length; i++) {
  const x = corners.at(i)!.x;
  const y = corners.at((i + 1) % corners.length)!.y;

  // Have to add and subtract 3. and 4. at the same time because the numbers get too big -_- 
  // -11566665988249564
  // -11692190884120664
  const x2 = corners.at((i + 1) % corners.length)!.x;
  const y2 = corners.at(i)!.y;
  step5 += x * y;
  step5 -= x2 * y2;
}

// 4. Multiply the y coordinate of each vertex by the x coordinate of the next vertex.
// let step4 = 0;
// for (let i = 0; i < corners.length; i++) {
//   const x = corners.at((i + 1) % corners.length)!.x;
//   const y = corners.at(i)!.y;
  
//   step4 += x * y;
// }

// console.log(step3)
// console.log(step4);
// // 5. Subtract the sum of the second products from the sum of the first products.
// let step5 = step3 - step4;

// 6. Divide this difference by 2 to get the area of the polygon.
console.log((((step5 + perimeter) / 2) + 1));
// console.log(perimeter);