import { Card } from './cards';

export type PlayerChoice = 'double down' | 'hit' | 'stand' | 'split';
export type Bet = 20 | 25 | 50 | 100 | 200;

export type PlayerState = {
  hand: Card[];
  score: number;
  isBusted: boolean;
  isBlackJack: boolean;
  bet: Bet | 0;
};

export type DealerState = {
  hand: Card[];
  score: number;
  isBusted: boolean;
  isEnded: boolean;
  isBlackJack: boolean;
};

export type Winner = 'dealer' | 'player' | 'draw';

export type EndGameState = {
  winner: Winner;
  playerWin: number;
};
