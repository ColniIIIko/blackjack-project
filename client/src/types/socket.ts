import { Bet, PlayerChoice, Room, User } from './general';
import { DealerState, PlayerState } from './state';

export type States = {
  players: PlayerState[];
  dealer: DealerState;
};

export interface ServerToClientEvents {
  'table-bet-accepted': (players: PlayerState[]) => void;
  'table-join': (states: States) => void;
  'table-full-update': (states: States) => void;
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
  'player-win': (win: number) => void;
  'player-room-created': (roomId: string) => void;
  rooms: (rooms: Room[]) => void;
  'room-dont-exist': () => void;
  'room-full': () => void;
}

export interface ClientToServerEvents {
  'player-game-start': () => void;
  'player-room-enter': (player: User, roomId: string) => void;
  'player-room-create': () => void;
  'player-decision': (decision: PlayerChoice) => void;
  'player-bet': (bet: Bet) => void;
  'player-insurance': (decision: boolean) => void;
  'player-room-leave': (roomId: string) => void;
}
