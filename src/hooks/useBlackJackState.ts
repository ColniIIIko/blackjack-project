import { useCallback, useEffect, useState } from 'react';
import { FakeSocket } from '../mock/fakeSocket';
import { Bet, PlayerChoice } from '../types/general';
import { DealerState, PlayerState } from '../types/state';

const INITIAL_PLAYER_STATE: PlayerState = {
  id: 'aaaa',
  name: 'anonymous',
  hand: [
    {
      id: '',
      cards: [],
      score: 0,
      isBlackJack: false,
      isBusted: false,
      bet: 0,
      result: null,
    },
  ],
  currentHand: {
    id: 'asf',
    cards: [],
    score: 0,
    isBlackJack: false,
    isBusted: false,
    bet: 0,
    result: null,
  },
  isSplitted: false,
  totalWin: null,
  balance: 1000,
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

export const useBlackJackState = (socket: FakeSocket) => {
  const [isChoosing, setIsChoosing] = useState(false);
  const [isBetting, setIsBetting] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_PLAYER_STATE);
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

  useEffect(() => {
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
      console.log(player);
      setPlayerState(player);
    });

    socket.on('start-game', () => {
      setPlayerState(INITIAL_PLAYER_STATE);
      setDealerState(INITIAL_DEALER_STATE);
      setIsGameEnd(false);
      setPlayerOptions([]);
    });

    socket.emit('connect', { id: 'aaaa', name: 'anonymous', balance: 1000 });
  }, [socket]);

  return {
    playerState,
    dealerState,
    isChoosing,
    isBetting,
    isGameEnd,
    playerOptions,
    handleBet,
    handleDecision,
  };
};
