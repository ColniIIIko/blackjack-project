import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { socket } from '../../mock/fakeSocket';
import { Bet, DealerState, PlayerChoice as PlayerDecision, PlayerState, Winner } from '../../types/general';
import BetChoice from '../BetChoice/BetChoice';
import Dealer from '../Dealer/Dealer';
import ModalWindow from '../ModalWindow/ModalWindow';
import Player from '../Player/Player';
import PlayerOptionChoice from '../PlayerOptionChoice/playerOptionChoice';

import styles from './gameTable.module.css';

function GameTable() {
  const {
    playerState,
    dealerState,
    isChoosing,
    isBetting,
    playerOptions,
    winner,
    isGameEnd,
    handleDecision,
    handleBet,
  } = useBlackJackState();
  const winLabel = useMemo(() => (winner === 'draw' ? 'DRAW' : `${winner?.toLocaleUpperCase()} WINS`), [winner]);
  return (
    <main className={styles['table']}>
      <ModalWindow isVisible={isChoosing}>
        <PlayerOptionChoice
          onChoice={(choice) => handleDecision(choice)}
          defaultChoice='stand'
          choices={playerOptions}
        />
      </ModalWindow>
      <ModalWindow isVisible={isBetting}>
        <BetChoice
          defaultBet={20}
          onBet={(bet) => handleBet(bet)}
        />
      </ModalWindow>
      {winner && <span className={styles['win-label']}>{winLabel}</span>}
      <Player
        {...playerState}
        isEnd={isGameEnd}
        winner={winner}
      />
      <Dealer {...dealerState} />
    </main>
  );
}

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

const useBlackJackState = () => {
  const [isChoosing, setIsChoosing] = useState(false);
  const [isBetting, setIsBetting] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_PLAYER_STATE);
  const [dealerState, setDealerState] = useState<DealerState>(INITIAL_DEALER_STATE);
  const [playerOptions, setPlayerOptions] = useState<PlayerDecision[]>([]);
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [winner, setWinner] = useState<Winner | null>(null);

  const handleDecision = useCallback((decision: PlayerDecision) => {
    setIsChoosing(false);
    socket.emit('player-decision', decision);
  }, []);

  const handleBet = useCallback((bet: Bet) => {
    setIsBetting(false);
    socket.emit('player-bet', bet);
  }, []);

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

    socket.on('make-decision', (possibleChoices: PlayerDecision[]) => {
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
  }, []);

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

export default GameTable;
