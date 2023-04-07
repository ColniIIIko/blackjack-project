import React from 'react';
import { useBlackJackState } from '../../hooks/useBlackJackState';
import { socket } from '../../mock/fakeSocket';
import BetChoice from '../BetChoice/BetChoice';
import Dealer from '../Dealer/Dealer';
import ModalWindow from '../ModalWindow/ModalWindow';
import Player from '../Player/Player';
import PlayerOptionChoice from '../PlayerOptionChoice/playerOptionChoice';

import styles from './gameTable.module.css';

function GameTable() {
  const { playerState, dealerState, isChoosing, isBetting, playerOptions, isGameEnd, handleDecision, handleBet } =
    useBlackJackState(socket);
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
      <Player
        {...playerState}
        isEnd={isGameEnd}
      />
      <Dealer {...dealerState} />
    </main>
  );
}

export default GameTable;
