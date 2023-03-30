import { cardSuits, cardValues } from '../utils/cards';

export type CardValue = typeof cardValues[number];
export type CardSuit = typeof cardSuits[number];
export type Card = {
  value: CardValue;
  suit: CardSuit;
  isHidden: boolean;
};
