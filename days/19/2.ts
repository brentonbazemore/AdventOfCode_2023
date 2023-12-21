import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const [rawWorkFlow, rawParts] = rawData.split('\n\n');

type Workflow = {
  name: string;
  steps: { variable: string, comparator: string, amount: number, destination: string }[];
}

const NO_OP = 'q';

const workflows = new Map<string, Workflow>();
rawWorkFlow.split('\n').forEach(line => {
  const [name, rawStepString] = line.replace('}', '').split('{');
  const rawSteps = rawStepString.split(',');
  const steps: Workflow['steps'] = [];
  // last one has special case
  for (let i = 0; i < rawSteps.length - 1; i++) {
    const [rawCondition, destination] = rawSteps[i].split(':');
    if (rawCondition.includes('>')) {
      const [variable, rawAmount] = rawCondition.split('>');
      const amount = +rawAmount;
      steps.push({ variable, amount, comparator: '>', destination });
    } else {
      const [variable, rawAmount] = rawCondition.split('<');
      const amount = +rawAmount;
      steps.push({ variable, amount, comparator: '<', destination });
    }
  }
  steps.push({ variable: NO_OP, amount: 0, comparator: '=', destination: rawSteps.at(-1)! });
  // console.log(steps);
  workflows.set(name, { name, steps });
});

// const parts = rawParts.split('\n').map(line => {
//   const rawPairs = line.replaceAll(/[{}]/g, '').split(',');
//   const part: { [variable: string]: number } = {}
//   rawPairs.forEach(rp => {
//     const [variable, rawAmount] = rp.split('=');
//     const amount = +rawAmount;
//     part[variable] = amount;
//   });
//   return part;
// });

// const comparators = {
//   '>': (validAmount: [number, number], stepAmount: number): [number, number] | null => {
//     if (validAmount[1] < stepAmount) {
//       return null;
//     }

//     if (validAmount[0] <= stepAmount) {
//       return [stepAmount + 1, validAmount[1]];
//     }

//     return validAmount;
//   },
//   '<': (validAmount: [number, number], stepAmount: number): [number, number] | null => {
//     if (validAmount[0] > stepAmount) {
//       return null;
//     }

//     if (validAmount[1] >= stepAmount) {
//       return [validAmount[0], stepAmount - 1];
//     }

//     return validAmount;
//   },
// }

type Range = { lower: number, upper: number };

const splitWorkflow = (workflowId: string, inputs: { x: Range, m: Range, a: Range, s: Range }) => {
  if (workflowId === 'A') {
    // console.log(inputs)
    const piece = ((inputs.x.upper - inputs.x.lower) + 1) 
          * ((inputs.m.upper - inputs.m.lower) + 1) 
          * ((inputs.a.upper - inputs.a.lower) + 1) 
          * ((inputs.s.upper - inputs.s.lower) + 1);
    // console.log(piece);
    return piece;
    
  }

  if (workflowId === 'R') {
    return 0;
  }

  let newInputs: typeof inputs = JSON.parse(JSON.stringify(inputs));
  const steps = workflows.get(workflowId)!.steps;
  let validAmount = 0;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.variable === NO_OP) {
      validAmount += splitWorkflow(step.destination, newInputs);
      break;
    }

    if (step.comparator === '>') {
      validAmount += splitWorkflow(step.destination, { ...newInputs, [step.variable]: { lower: step.amount + 1, upper: newInputs[step.variable as 'x'].upper }});
      newInputs = { ...newInputs, [step.variable]: { lower: newInputs[step.variable as 'x'].lower, upper: step.amount }};
    }
    if (step.comparator === '<') {
      validAmount += splitWorkflow(step.destination, { ...newInputs, [step.variable]: { lower: newInputs[step.variable as 'x'].lower, upper: step.amount - 1 }});
      newInputs = { ...newInputs, [step.variable]: { lower: step.amount, upper: newInputs[step.variable as 'x'].upper }};
    }
  }

  return validAmount;
}

const out = splitWorkflow('in', { x: { lower: 1, upper: 4000 }, m: { lower: 1, upper: 4000 }, a: { lower: 1, upper: 4000 }, s: { lower: 1, upper: 4000 } });
console.log(out);

// console.log(accepted);
// 
// const acceptedParts = parts.filter(part => {
//   let workflow = 'in';

//   let sorted = '';
//   while (!sorted) {
//     // console.log(workflow);
//     if (workflow === 'A') {
//       sorted = 'accepted';
//       break;
//     }
//     if (workflow === 'R') {
//       sorted = 'rejected';
//       break;
//     }

//     const steps = workflows.get(workflow)!.steps;
//     for (let i = 0; i < steps.length; i++) {
//       const step = steps[i];
//       if (step.variable === NO_OP) {
//         workflow = step.destination;
//         break;
//       }
  
//       // console.log(part[step.variable], step.comparator, step.amount)
//       if (comparators[step.comparator as '>' | '<'](part[step.variable as 'x'], step.amount)) {
//         workflow = step.destination;
//         break;
//       }
//     }
//   }

//   // console.log(sorted);
//   return sorted === 'accepted';
// });

// let sum = 0;
// acceptedParts.forEach(part => sum += part.x + part.m + part.a + part.s);
// console.log(sum);

// console.log(workflows);