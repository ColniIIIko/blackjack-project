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

export const useBlackJackState = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  user: User,
  roomId: string
) => {
  const [isChoosing, setIsChoosing] = useState(false);
  const [isBetting, setIsBetting] = useState(false);
  const [isInsurance, setIsInsurance] = useState(false);
  const [isSingle, setIsSingle] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [playerWin, setPlayerWin] = useState<number | null>(null);
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
    const onPlayers = (players: PlayerState[]) => {
      setPlayersState(players);
    };

    const onInitialCards = (states: States) => {
      setPlayersState(states.players);
      setDealerState(states.dealer);
    };

    const onWin = (win: number) => {
      setPlayerWin(win);
    };

    const onStates = (states: States) => {
      setIsIdle(states.players.length === 1);
      setPlayersState(states.players);
      setDealerState(states.dealer);
    };

    const onMakeBet = () => {
      setIsBetting(true);
    };

    const onMakeInsurance = () => {
      setIsInsurance(true);
    };

    const onMakeDecision = (possibleChoices: PlayerChoice[]) => {
      setPlayerOptions(possibleChoices);
      setIsChoosing(true);
    };

    const onDealerDraw = (dealer: DealerState) => {
      setDealerState(dealer);
    };

    const onGameEnd = (players: PlayerState[]) => {
      setIsGameEnd(true);
      setPlayersState(players);
    };

    socket.on('table-update', onPlayers);
    socket.on('table-next-player', onPlayers);
    socket.on('table-bet-accepted', onPlayers);
    socket.on('table-player-draw', onPlayers);
    socket.on('table-next-hand', onPlayers);

    socket.on('table-full-update', onStates);
    socket.on('table-join', onStates);

    socket.on('table-initial-cards', onInitialCards);

    socket.on('table-make-bet', onMakeBet);

    socket.on('table-make-insurance', onMakeInsurance);

    socket.on('make-decision', onMakeDecision);

    socket.on('table-dealer-draw', onDealerDraw);

    socket.on('player-win', onWin);

    socket.on('table-end-game', onGameEnd);

    return () => {
      socket.off('table-update', onPlayers);
      socket.off('table-next-player', onPlayers);
      socket.off('table-bet-accepted', onPlayers);
      socket.off('table-player-draw', onPlayers);
      socket.off('table-next-hand', onPlayers);

      socket.off('table-join', onStates);

      socket.off('table-initial-cards', onInitialCards);

      socket.off('table-make-bet', onMakeBet);

      socket.off('table-make-insurance', onMakeInsurance);

      socket.off('make-decision', onMakeDecision);

      socket.off('table-dealer-draw', onDealerDraw);

      socket.off('player-win', onWin);

      socket.off('table-end-game', onGameEnd);
    };
  }, [socket]);

  useEffect(() => {
    const onGameStart = (players: PlayerState[], isSingle: boolean) => {
      setPlayerWin(null);
      setIsIdle(false);
      setIsSingle(isSingle);
      setPlayersState(players);
      setDealerState(INITIAL_DEALER_STATE);
      setIsGameEnd(false);
      setPlayerOptions([]);
    };

    socket.on('table-start-game', onGameStart);

    return () => {
      socket.off('table-start-game', onGameStart);
    };
  }, [socket, user]);

  useEffect(() => {
    socket.emit('player-room-enter', user, roomId);
  }, [roomId, socket, user]);

  return {
    playerWin,
    playersState,
    dealerState,
    isIdle,
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
