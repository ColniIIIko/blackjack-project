import { Bet, PlayerChoice, User } from './general';
import { DealerState, PlayerState } from './state';

export type States = {
  players: PlayerState[];
  dealer: DealerState;
};

export interface ServerToClientEvents {
  'table-bet-accepted': (players: PlayerState[]) => void;
  'table-join': (players: PlayerState[]) => void;
  'table-update': (player: PlayerState[]) => void;
  'table-initial-cards': (states: States) => void;
  'table-make-bet': () => void;
  'table-make-insurance': () => void;
  'make-decision': (possibleChoices: PlayerChoice[]) => void;
  'table-player-draw': (player: PlayerState[]) => void;
  'table-next-hand': (player: PlayerState[]) => void;
  'table-next-player': (player: PlayerState[]) => void;
  'table-dealer-draw': (dealer: DealerState) => void;
  'table-end-game': (player: PlayerState[]) => void;
  'table-start-game': (player: PlayerState[], isSingle: boolean) => void;
  'player-balance-update': (player: PlayerState) => void;
}

export interface ClientToServerEvents {
  'player-room-enter': (player: User) => void;
  'player-decision': (decision: PlayerChoice) => void;
  'player-bet': (bet: Bet) => void;
  'player-insurance': (decision: boolean) => void;
}
