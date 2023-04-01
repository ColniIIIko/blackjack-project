import { cardSuits, cardValues } from './cards';

export const getCardsString = () => {
  const cards: string[] = [];
  for (const suit of cardSuits) {
    for (const value of cardValues) {
      cards.push(`${suit}_${value}`);
    }
  }

  return cards;
};
