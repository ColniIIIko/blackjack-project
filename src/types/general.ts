import { Card } from './cards';

export type PlayerChoice = 'double down' | 'hit' | 'stand' | 'split';
export type Bet = 20 | 25 | 50 | 100 | 200;

export type PlayerState = {
  hand: Card[];
  score: number;
  isBusted: boolean;
  bet?: Bet;
};

export type DealerState = PlayerState & {
  isEnded: boolean;
};

export type Winner = 'dealer' | 'player' | 'draw';
