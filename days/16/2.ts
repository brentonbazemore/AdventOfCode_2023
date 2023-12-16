import '../../types/helper.d.ts';
import * as _ from 'lodash';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

// const display = () => {
//   for (let y = 0; y < data.length; y++) {
//     let row = '';
//     for (let x = 0; x < data[0].length; x++) {
//       row += path.has(`${x}_${y}`) ? '#' : '.';
//     }
//     console.log(row);
//   }
// }

enum Direction {
  UP, RIGHT, DOWN, LEFT
}

type Beam = { direction: Direction, location: { x: number, y: number } };
const check = (x: number, y: number, start: Direction) => {
  let beams: Beam[] = [
    { direction: start, location: { x, y } }
  ];

  const bounds = {
    top: 0, left: 0, right: data[0].length, bottom: data.length,
  };
  const path = new Map<string, Set<Direction>>();

  const handleDot = (beam: Beam) => {
    if (beam.direction === Direction.UP) {
      beam.location.y -= 1;
    } else if (beam.direction === Direction.DOWN) {
      beam.location.y += 1;
    } else if (beam.direction === Direction.RIGHT) {
      beam.location.x += 1;
    } else if (beam.direction === Direction.LEFT) {
      beam.location.x -= 1;
    }
  }

  // \
  const handleBackSlash = (beam: Beam) => {
    if (beam.direction === Direction.UP) {
      beam.location.x -= 1;
      beam.direction = Direction.LEFT;
    } else if (beam.direction === Direction.DOWN) {
      beam.location.x += 1;
      beam.direction = Direction.RIGHT;
    } else if (beam.direction === Direction.RIGHT) {
      beam.location.y += 1;
      beam.direction = Direction.DOWN;
    } else if (beam.direction === Direction.LEFT) {
      beam.location.y -= 1;
      beam.direction = Direction.UP;
    }
  }

  // /
  const handleForwardSlash = (beam: Beam) => {
    if (beam.direction === Direction.UP) {
      beam.location.x += 1;
      beam.direction = Direction.RIGHT;
    } else if (beam.direction === Direction.DOWN) {
      beam.location.x -= 1;
      beam.direction = Direction.LEFT;
    } else if (beam.direction === Direction.RIGHT) {
      beam.location.y -= 1;
      beam.direction = Direction.UP;
    } else if (beam.direction === Direction.LEFT) {
      beam.location.y += 1;
      beam.direction = Direction.DOWN;
    }
  }

  // |
  const handleVerticalSplit = (beam: Beam) => {
    if (beam.direction === Direction.UP) {
      beam.location.y -= 1;
    } else if (beam.direction === Direction.DOWN) {
      beam.location.y += 1;
    } else if (beam.direction === Direction.RIGHT) {
      beams.push({ location: { x: beam.location.x, y: beam.location.y + 1 }, direction: Direction.DOWN });
      beam.location.y -= 1;
      beam.direction = Direction.UP;
    } else if (beam.direction === Direction.LEFT) {
      beams.push({ location: { x: beam.location.x, y: beam.location.y + 1 }, direction: Direction.DOWN });
      beam.location.y -= 1;
      beam.direction = Direction.UP;
    }
  }

  // -
  const handleHorizontalSplit = (beam: Beam) => {
    if (beam.direction === Direction.UP) {
      beams.push({ location: { x: beam.location.x - 1, y: beam.location.y }, direction: Direction.LEFT });
      beam.location.x += 1;
      beam.direction = Direction.RIGHT;
    } else if (beam.direction === Direction.DOWN) {
      beams.push({ location: { x: beam.location.x - 1, y: beam.location.y }, direction: Direction.LEFT });
      beam.location.x += 1;
      beam.direction = Direction.RIGHT;
    } else if (beam.direction === Direction.RIGHT) {
      beam.location.x += 1;
    } else if (beam.direction === Direction.LEFT) {
      beam.location.x -= 1;
    }
  }

  let prev = path.size;
  let prevSeen = 0;
  while (beams.length > 0) {
    if (path.size === prev) {
      prevSeen++;
    } else {
      prevSeen = 0;
      prev = path.size;
    }

    // stop when the path size stops increasing
    if (prevSeen > 10) {
      break;
    }

    beams.forEach(beam => {
      const key = `${beam.location.x}_${beam.location.y}`;
      if (path.has(key)) {
        path.get(key)!.add(beam.direction);
      } else {
        path.set(key, new Set([beam.direction]));
      }
      const tile = data[beam.location.y][beam.location.x];
      if (tile === '.') {
        handleDot(beam);
      }
    
      if (tile === '\\') {
        handleBackSlash(beam);
      }
    
      if (tile === '/') {
        handleForwardSlash(beam);
      }
    
      if (tile === '|') {
        handleVerticalSplit(beam);
      }

      if (tile === '-') {
        handleHorizontalSplit(beam);
      }

      return true;
    });

    // console.log(beams.length);
    // console.log(path.size)

    beams = beams.filter(beam => {
      const key = `${beam.location.x}_${beam.location.y}`;
      if (beam.location.y < bounds.top 
        || beam.location.y >= bounds.bottom 
        || beam.location.x < bounds.left 
        || beam.location.x >= bounds.right 
        || (path.has(key) && path.get(key)!.has(beam.direction))) {
        return false;
      }
      return true;
    });
  }
  return path.size;
}

let values: number[] = [];
for (let y = 0; y < data.length; y++) {
  values.push(check(0, y, Direction.RIGHT));
  values.push(check(data[0].length - 1, y, Direction.LEFT));
}

for (let x = 0; x < data[0].length; x++) {
  values.push(check(x, 0, Direction.DOWN));
  values.push(check(x, data.length - 1, Direction.UP));
}

console.log(_.max(values));