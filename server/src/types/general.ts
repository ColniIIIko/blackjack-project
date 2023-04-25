import { Card } from './cards';

export type PlayerChoice = 'double down' | 'hit' | 'stand' | 'split';
export type Bet = 20 | 25 | 50 | 100 | 200;

export interface User {
  id: string;
  name: string;
  balance: number;
}

export interface Player extends User {
  hand: Hand[];
  currentHand: Hand;
  isSplitted: boolean;
  totalWin: number | null;
}

export interface Hand {
  id: string;
  cards: Card[];
  score: number;
  isBlackJack: boolean;
  isBusted: boolean;
}

export interface Dealer {
  hand: Hand;
  isEnded: boolean;
}

export enum GameStatus {
  BETTING = 'betting',
  PLAYING = 'playing',
  DEALER_PLAY = 'dealer',
  IDLE = 'idle',
}

export type Room = {
  id: string;
  playersCount: number;
  maxPlayersCount: number;
};

export type Winner = 'dealer' | 'player' | 'draw';
