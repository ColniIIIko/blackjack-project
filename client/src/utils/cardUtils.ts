import { Card, CardValue } from '@/types/cards';

// handling ace
export const cardStringValueToNumber = (cardValue: CardValue) => {
  if (cardValue === 'A') return 11;
  const value = Number(cardValue);
  return isNaN(value) ? 10 : value;
};

export const getCardsScore = (cards: Card[]) => {
  const hasAce = cards.some((card) => card.value === 'A');

  let resultScore = cards.reduce(
    (score, card) => (card.isHidden ? score : score + cardStringValueToNumber(card.value)),
    0
  );
  if (hasAce && resultScore > 21) {
    resultScore -= 10;
  }

  return resultScore;
};

export const isBlackJack = (cards: Card[]) => {
  if (cards.length !== 2) return false;

  return getCardsScore(cards) === 21;
};
