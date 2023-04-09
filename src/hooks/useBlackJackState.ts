import { useCallback, useEffect, useState } from 'react';
import { FakeSocket } from '../mock/fakeSocket';
import { Bet, PlayerChoice, User } from '../types/general';
import { DealerState, PlayerState } from '../types/state';

const INITIAL_PLAYER_STATE = {
  hand: [],
  currentHand: {
    id: '',
    cards: [],
    score: 0,
    isBlackJack: false,
    isBusted: false,
    bet: 0,
    result: null,
  },
  isSplitted: false,
  totalWin: null,
  insuranceBet: null,
};

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
  player: PlayerState;
  dealer: DealerState;
};

export const useBlackJackState = (socket: FakeSocket, user: User) => {
  const [isChoosing, setIsChoosing] = useState(false);
  const [isBetting, setIsBetting] = useState(false);
  const [isInsurance, setIsInsurance] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>({ ...INITIAL_PLAYER_STATE, ...user } as PlayerState);
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
    socket.on('player-update', (player: PlayerState) => {
      setPlayerState(player);
    });

    socket.on('initial-cards', (states: States) => {
      setPlayerState(states.player);
      setDealerState(states.dealer);
    });

    socket.on('make-bet', () => {
      setIsBetting(true);
    });

    socket.on('player-bet-accepted', (player: PlayerState) => {
      setPlayerState(player);
    });

    socket.on('make-insurance', () => {
      setIsInsurance(true);
    });

    socket.on('make-decision', (possibleChoices: PlayerChoice[]) => {
      setPlayerOptions(possibleChoices);
      setIsChoosing(true);
    });

    socket.on('player-draw', (player: PlayerState) => {
      setPlayerState(player);
    });

    socket.on('next-hand', (player: PlayerState) => {
      setPlayerState(player);
    });

    socket.on('dealer-draw', (dealer: DealerState) => {
      setDealerState(dealer);
    });

    socket.on('end-game', (player: PlayerState) => {
      setIsGameEnd(true);
      setPlayerState(player);
    });
  }, [socket]);

  useEffect(() => {
    socket.on('start-game', (player: PlayerState) => {
      setPlayerState(player);
      setDealerState(INITIAL_DEALER_STATE);
      setIsGameEnd(false);
      setPlayerOptions([]);
    });
  }, [socket, user]);

  useEffect(() => {
    socket.emit('connect', user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    playerState,
    dealerState,
    isChoosing,
    isBetting,
    isInsurance,
    isGameEnd,
    playerOptions,
    handleBet,
    handleDecision,
    handleInsurance,
  };
};
