import { useCallback, useEffect, useState } from 'react';
import { FakeSocket } from '../mock/fakeSocket';
import { Bet, DealerState, PlayerChoice, PlayerState, Winner } from '../types/general';

const INITIAL_PLAYER_STATE: PlayerState = {
  hand: [],
  isBusted: false,
  score: 0,
  isBlackJack: false,
  bet: 0,
};

const INITIAL_DEALER_STATE: DealerState = {
  hand: [],
  isBusted: false,
  score: 0,
  isEnded: false,
  isBlackJack: false,
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
  const [winner, setWinner] = useState<Winner | null>(null);

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

    socket.on('dealer-draw', (dealer: DealerState) => {
      setDealerState(dealer);
    });

    socket.on('end-game', ({ winner }: { winner: Winner }) => {
      setIsGameEnd(true);
      setWinner(winner);
    });

    socket.on('start-game', () => {
      setPlayerState(INITIAL_PLAYER_STATE);
      setDealerState(INITIAL_DEALER_STATE);
      setWinner(null);
      setIsGameEnd(false);
      setPlayerOptions([]);
    });

    socket.emit('start-game');
  }, [socket]);

  return {
    playerState,
    dealerState,
    isChoosing,
    isBetting,
    winner,
    isGameEnd,
    playerOptions,
    handleBet,
    handleDecision,
  };
};
