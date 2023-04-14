import { Bet, PlayerChoice, User } from './general';
import { DealerState, PlayerState } from './state';

export type States = {
  players: PlayerState[];
  dealer: DealerState;
};

export interface ServerToClientEvents {
  'table-bet-accepted': (players: PlayerState[]) => void;
  'table-join': (states: States) => void;
  'table-update': (players: PlayerState[]) => void;
  'table-initial-cards': (states: States) => void;
  'table-make-bet': () => void;
  'table-make-insurance': () => void;
  'make-decision': (possibleChoices: PlayerChoice[]) => void;
  'table-player-draw': (players: PlayerState[]) => void;
  'table-next-hand': (players: PlayerState[]) => void;
  'table-next-player': (players: PlayerState[]) => void;
  'table-dealer-draw': (dealer: DealerState) => void;
  'table-end-game': (players: PlayerState[]) => void;
  'table-start-game': (players: PlayerState[], isSingle: boolean) => void;
  'player-balance-update': (player: PlayerState) => void;
}

export interface ClientToServerEvents {
  'player-room-enter': (player: User) => void;
  'player-decision': (decision: PlayerChoice) => void;
  'player-bet': (bet: Bet) => void;
  'player-insurance': (decision: boolean) => void;
}
