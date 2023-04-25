import { cardSuits, cardValues } from '@/const';

export type CardValue = (typeof cardValues)[number];
export type CardSuit = (typeof cardSuits)[number];
export type Card = {
  value: CardValue;
  suit: CardSuit;
  isHidden: boolean;
};
