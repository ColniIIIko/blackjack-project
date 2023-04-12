import { useCallback, useEffect, useState } from 'react';
import { Bet, PlayerChoice, User } from '../types/general';
import { DealerState, PlayerState } from '../types/state';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socket';

const INITIAL_DEALER_STATE: DealerState = {
  hand: {
    id: '',
    cards: [],
    score: 0,
    isBlackJack: false,
    isBusted: false,
  },
  isEnded: false,
};

type States = {
  players: PlayerState[];
  dealer: DealerState;
};

export const useBlackJackState = (socket: Socket<ServerToClientEvents, ClientToServerEvents>, user: User) => {
  const [isChoosing, setIsChoosing] = useState(false);
  const [isBetting, setIsBetting] = useState(false);
  const [isInsurance, setIsInsurance] = useState(false);
  const [isSingle, setIsSingle] = useState(false);
  const [playersState, setPlayersState] = useState<PlayerState[]>([]);
  const [dealerState, setDealerState] = useState<DealerState>(INITIAL_DEALER_STATE);
  const [playerOptions, setPlayerOptions] = useState<PlayerChoice[]>([]);
  const [isGameEnd, setIsGameEnd] = useState(false);

  const handleDecision = useCallback(
    (decision: PlayerChoice) => {
      setIsChoosing(false);
      socket.emit('player-decision', decision);
    },
    [socket]
  );

  const handleBet = useCallback(
    (bet: Bet) => {
      setIsBetting(false);
      socket.emit('player-bet', bet);
    },
    [socket]
  );

  const handleInsurance = useCallback(
    (decision: boolean) => {
      setIsInsurance(false);
      socket.emit('player-insurance', decision);
    },
    [socket]
  );

  useEffect(() => {
    socket.on('table-update', (players: PlayerState[]) => {
      setPlayersState(players);
    });

    socket.on('table-initial-cards', (states: States) => {
      setPlayersState(states.players);
      setDealerState(states.dealer);
    });

    socket.on('table-make-bet', () => {
      setIsBetting(true);
    });

    socket.on('table-bet-accepted', (players: PlayerState[]) => {
      setPlayersState(players);
    });

    socket.on('table-make-insurance', () => {
      setIsInsurance(true);
    });

    socket.on('make-decision', (possibleChoices: PlayerChoice[]) => {
      setPlayerOptions(possibleChoices);
      setIsChoosing(true);
    });

    socket.on('table-player-draw', (players: PlayerState[]) => {
      setPlayersState(players);
    });

    socket.on('table-next-hand', (players: PlayerState[]) => {
      setPlayersState(players);
    });

    socket.on('table-dealer-draw', (dealer: DealerState) => {
      setDealerState(dealer);
    });

    socket.on('table-end-game', (players: PlayerState[]) => {
      setIsGameEnd(true);
      setPlayersState(players);
    });

    socket.on('table-next-player', (players: PlayerState[]) => {
      setPlayersState(players);
    });

    socket.on('table-join', (players: PlayerState[]) => {
      setPlayersState(players);
    });
  }, [socket]);

  useEffect(() => {
    socket.on('table-start-game', (players: PlayerState[], isSingle: boolean) => {
      setIsSingle(isSingle);
      setPlayersState(players);
      setDealerState(INITIAL_DEALER_STATE);
      setIsGameEnd(false);
      setPlayerOptions([]);
    });
  }, [socket, user]);

  useEffect(() => {
    socket.emit('player-room-enter', user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    playersState,
    dealerState,
    isChoosing,
    isBetting,
    isInsurance,
    isGameEnd,
    isSingle,
    playerOptions,
    handleBet,
    handleDecision,
    handleInsurance,
  };
};
