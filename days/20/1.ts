import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

enum State {
  ON, OFF
}

enum Strength {
  HIGH = 'high', 
  LOW = 'low'
}

interface Module {
  id: string;
  type: 'FlipFlop' | 'Conjunction' | 'Broadcaster';
  descendents: string[];
  pulse: (id: string, strength: Strength) => { id: string, strength: Strength }[];
}

const modules: { [id: string]: Module } = {};

class FlipFlop implements Module {
  type = 'FlipFlop' as const;
  id: string;
  state = State.OFF;
  descendents: string[];
  
  constructor(line: string) {
    const [rawId, rawDescendents] = line.split(' -> ');
    this.id = rawId.substring(1);
    this.descendents = rawDescendents.split(', ');
  }

  pulse(id: string, strength: Strength) {
    console.log(id, `-${strength}->`, this.id)
    if (strength === Strength.HIGH) {
      return [];
    }

    if (this.state === State.OFF) {
      this.state = State.ON;
      return [{ id: this.id, strength: Strength.HIGH }];
      // return this.descendents.map(child => {
      //   return { id: child, strength: Strength.HIGH };
      // })
    } else if (this.state === State.ON) {
      this.state = State.OFF;
      return [{ id: this.id, strength: Strength.LOW }];
      // return this.descendents.map(child => {
      //   return { id: child, strength: Strength.LOW };
      // });
    }

    return [];
  };
}

class Conjunction implements Module {
  type = 'Conjunction' as const;
  id: string;
  descendents: string[];
  inputs: { [id: string]: Strength } = {};
  
  constructor(line: string) {
    const [rawId, rawDescendents] = line.split(' -> ');
    this.id = rawId.substring(1);
    this.descendents = rawDescendents.split(', ');
  }

  addInput(id: string) {
    this.inputs[id] = Strength.LOW;
  }

  pulse(id: string, strength: Strength) {
    console.log(id, `-${strength}->`, this.id)
    this.inputs[id] = strength;

    if (Object.values(this.inputs).every(input => input === Strength.HIGH)) {
      return [{ id: this.id, strength: Strength.LOW }];
      // return this.descendents.map(child => {
      //   return { id: child, strength: Strength.LOW };
      // });
    } else {
      return [{ id: this.id, strength: Strength.HIGH }];
      // return this.descendents.map(child => {
      //   return { id: child, strength: Strength.HIGH };
      // });
    }
  };
}

class Broadcaster implements Module {
  type = 'Broadcaster' as const;
  id: string;
  descendents: string[];
  
  constructor(line: string) {
    const [id, rawDescendents] = line.split(' -> ');
    this.id = id;
    this.descendents = rawDescendents.split(', ');
  }

  pulse(id: string, strength: Strength) {
    console.log(id, `-${strength}->`, this.id)
    return [{ id: this.id, strength }];
    // return this.descendents.map(child => {
    //   return { id: child, strength }
    // });
  }
}

data.forEach(line => {
  let module;
  if (line[0] === '%') {
    module = new FlipFlop(line);
    modules[module.id] = module;
  }
  if (line[0] === '&') {
    module = new Conjunction(line);
    modules[module.id] = module;
  }
  if (line[0] === 'b') {
    module = new Broadcaster(line);
    modules[module.id] = module;
  }
});

Object.keys(modules).forEach(moduleId => {
  modules[moduleId].descendents.forEach(child => {
    if (modules[child] && modules[child].type === 'Conjunction') {
      (modules[child] as Conjunction).addInput(moduleId);
    }
  });
});

let lowCount = 0; // starts at 1 because button press
let highCount = 0;
const BUTTON_PRESSES = 1000;
for (let i = 0; i < BUTTON_PRESSES; i++) {
  lowCount++; // button press
  const queue = [{ id: 'broadcaster', strength: Strength.LOW }];
  while (queue.length > 0) {
    const { id, strength } = queue.shift()!;

    for (let j = 0; j < modules[id].descendents.length; j++) {
      const child = modules[id].descendents[j];
      if (strength === Strength.LOW) {
        lowCount++;
      } else {
        highCount++;
      }

      if (modules[child] == null) {
        console.log(`${id} -${strength}-> ${child}`);
        continue;
      }

      const newPulses = modules[child]!.pulse(id, strength);
      // console.log(newPulses);
      newPulses.forEach((pulse) => {
        // console.log(pulse);
        queue.push(pulse);
      })
    }
  }
}

console.log({ lowCount, highCount })
console.log(lowCount * highCount)