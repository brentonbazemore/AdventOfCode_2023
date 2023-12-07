import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const rankedCards: Record<Card, number> = { J: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, T: 9, Q: 10, K: 11, A: 12 };

type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
type Hand = [Card, Card, Card, Card, Card];
type CountedHand = Map<Card, number>;

const countCards = (hand: Hand) => {
  const occurences = new Map<Card, number>();
  hand.forEach((card) => {
    occurences.set(card, (occurences.get(card) ?? 0) + 1);
  });
  return occurences;
};

const useJoker = (card: Card) => card != 'J';

const five = (hand: CountedHand) => {
  let match = false;
  hand.forEach((count, card) => {
    let wildCount = 0;
    if (useJoker(card)) {
      wildCount = hand.get('J') ?? 0;
    }
    if (count === 5 - wildCount) {
      match = true;
    }
  });
  return match;
};

const four = (hand: CountedHand) => {
  let match = false;
  hand.forEach((count, card) => {
    let wildCount = 0;
    if (useJoker(card)) {
      wildCount = hand.get('J') ?? 0;
    }
    if (count === 4 - wildCount) {
      match = true;
    }
  });
  return match;
};

const three = (hand: CountedHand) => {
  let match = false;
  hand.forEach((count, card) => {
    let wildCount = 0;
    if (useJoker(card)) {
      wildCount = hand.get('J') ?? 0;
    }
    if (count === 3 - wildCount) {
      match = true;
    }
  });
  return match;
};

const twoPair = (hand: CountedHand) => {
  let pairCount = 0;
  hand.forEach((count, card) => {
    let wildCount = 0;
    if (useJoker(card)) {
      wildCount = hand.get('J') ?? 0;
    }
    if (count === 2 - wildCount) {
      wildCount -= count;
      pairCount++;
    }
  });
  return pairCount === 2;
};

const onePair = (hand: CountedHand) => {
  let match = false;
  hand.forEach((count, card) => {
    let wildCount = 0;
    if (useJoker(card)) {
      wildCount = hand.get('J') ?? 0;
    }
    if (count === 2 - wildCount) {
      match = true;
    }
  });
  return match;
};

const fullHouse = (hand: CountedHand) => {
  let matched = false;

  let match3 = false;
  let match2 = false;

  const wildCount = hand.get('J') ?? 0;
  // try with j as the 3
  hand.forEach((count, card) => {
    if (card === 'J') {
      return;
    }
    if (!match3 && count === 3 - (useJoker(card) ? wildCount : 0)) {
      match3 = true;
    } else if (count === 2) {
      match2 = true;
    }
  });

  matched = match3 && match2;
// TJ8J5
  // then try it with j as the pair
  if (!matched) {
    match2 = false;
    match3 = false;
    hand.forEach((count, card) => {
      if (card === 'J') {
        return;
      }
      if (!match2 && count === 2 - (useJoker(card) ? wildCount : 0)) {
        match2 = true;
      } else if (count === 3) {
        match3 = true;
      }
    });
  }
  
  return match3 && match2;
};

const one = (hand: CountedHand) => {
  return true;
};

const breakTie = (a: Hand, b: Hand) => {
  for (let i = 0; i < a.length; i++) {
    const cardA = a[i];
    const cardB = b[i];
    if (cardA === cardB) {
      continue;
    }

    return rankedCards[cardA] - rankedCards[cardB];
  }

  return 0;
};

const hands = data.map((line) => {
  const [rawHand, rawBid] = line.split(' ');
  const hand = rawHand.split('') as Hand;
  const bid = +rawBid;

  return { hand, bid };
});

const checkWinner = (a: Hand, b: Hand, comparator: (hand: CountedHand) => boolean) => {
  const countedA = countCards(a);
  const countedB = countCards(b);
  const aMatch = comparator(countedA);
  const bMatch = comparator(countedB);
  if (aMatch || bMatch) {
    if (aMatch && bMatch) {
      // console.log(a.join('').replaceAll('J', '*'), comparator);
      return breakTie(a, b);
    }

    if (aMatch) {
      // console.log(a.join('').replaceAll('J', '*'), comparator);
      return 1;
    }

    if (bMatch) {
      return -1;
    }
  }
};

const orderedComparators = [five, four, fullHouse, three, twoPair, onePair, one];

hands.sort((a, b) => {
  for (let i = 0; i < orderedComparators.length; i++) {
    const comparator = orderedComparators[i];
    const result = checkWinner(a.hand, b.hand, comparator);
    if (result != undefined) {
      return result;
    }
  }

  console.log('missed');
  return 0;
});

// hands.forEach(hand => {
//   const counted = countCards(hand.hand);
//   for (let i = 0; i < orderedComparators.length; i++) {
//     const comparator = orderedComparators[i];
//     if (comparator(counted) && (counted.get('J') ?? 0) > 0) {
//       console.log(hand.hand.join('').replaceAll('J', '*'), comparator);
//       break;
//     }
//   }
//   // console.log(hand.hand.join('').replaceAll('J', '*'));
// })

let sum = 0;
hands.forEach((hand, i) => (sum += hand.bid * (i + 1)));
console.log(sum);
// AA88* full house