import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const rankedCards: Record<Card, number> = {2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, T: 9, J: 10, Q: 11, K: 12, A: 13};

type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
type Hand = [Card, Card, Card, Card, Card];
type CountedHand = Map<Card, number>;

const countCards = (hand: Hand) => {
  const occurences = new Map<Card, number>();
  hand.forEach((card) => {
    occurences.set(card, (occurences.get(card) ?? 0) + 1);
  });
  return occurences;
}

const five = (hand: CountedHand) => {
  let match = false;
  hand.forEach((count) => {
    if (count === 5) {
      match = true;
    }
  });
  return match;
}

const four = (hand: CountedHand) => {
  let match = false;
  hand.forEach((count) => {
    if (count === 4) {
      match = true;
    }
  });
  return match;
}

const three = (hand: CountedHand) => {
  let match = false;
  hand.forEach((count) => {
    if (count === 3) {
      match = true;
    }
  });
  return match;
}

const twoPair = (hand: CountedHand) => {
  let pairCount = 0;
  hand.forEach((count) => {
    if (count === 2) {
      pairCount++;
    }
  });
  return pairCount === 2;
}

const onePair = (hand: CountedHand) => {
  let match = false;
  hand.forEach((count) => {
    if (count === 2) {
      match = true;
    }
  });
  return match;
}

const fullHouse = (hand: CountedHand) => {
  let match = false;
  if (three(hand) && onePair(hand)) {
    match = true;
  }
  return match;
}

const one = (hand: CountedHand) => {
  return true;
}

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
}

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
      return breakTie(a, b);
    }

    if (aMatch) {
      return 1
    }

    if (bMatch) {
      return -1;
    }
  }
}

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
//   console.log(hand.hand);
// })

let sum = 0;
hands.forEach((hand, i) => sum += hand.bid * (i + 1));
console.log(sum);