import { Bet, Hand, Winner } from './general';

export type PlayerHand = Hand & {
  bet: Bet | 0;
  result: Winner | null;
};

export type PlayerState = {
  id: string;
  name: string;
  hand: PlayerHand[];
  currentHand: PlayerHand;
  isSplitted: boolean;
  totalWin: number | null;
  balance: number;
  insuranceBet: number | null;
  isActive: boolean;
};

export type DealerState = {
  hand: Hand;
  isEnded: boolean;
};
