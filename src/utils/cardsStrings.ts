import { cardSuits, cardValues } from '../const';

export const getCardsString = () => {
  const cards: string[] = [];
  for (const suit of cardSuits) {
    for (const value of cardValues) {
      cards.push(`${suit}_${value}`);
    }
  }

  return cards;
};
