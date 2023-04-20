import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { useBlackJackState } from '../../hooks/useBlackJackState';
import { socket } from '../../socket';
import { UserContext } from '../../stores/UserStore/UserStore';
import BetChoice from '../BetChoice/BetChoice';
import Dealer from '../Dealer/Dealer';
import InsuranceOptionChoice from '../InsuranceOptionChoice/InsuranceOptionChoice';
import ModalWindow from '../ModalWindow/ModalWindow';
import PlayerOptionChoice from '../PlayerOptionChoice/playerOptionChoice';
import Players from '../Players/Players';

import styles from './gameTable.module.css';
import { PlayerState } from '../../types/state';
import StartGameButton from '../StartGameButton/StartGameButton';
import GameTableHeader from '../GameTableHeader/GameTableHeader';

const GameTable = observer(function () {
  const user = useContext(UserContext)!;
  const {
    playersState,
    dealerState,
    isChoosing,
    isBetting,
    isIdle,
    isInsurance,
    playerOptions,
    isGameEnd,
    isSingle,
    handleInsurance,
    handleDecision,
    handleBet,
  } = useBlackJackState(socket, user);

  useEffect(() => {
    const onBalanceUpdate = (player: PlayerState) => {
      user.changeBalance(player.balance);
    };

    socket.on('player-balance-update', onBalanceUpdate);

    return () => {
      socket.off('player-balance-update', onBalanceUpdate);
    };
  }, [user]);

  return (
    <main className={styles['table']}>
      <ModalWindow isVisible={isChoosing}>
        <PlayerOptionChoice
          onChoice={(choice) => handleDecision(choice)}
          choices={playerOptions}
          isTimerOn={!isSingle}
        />
      </ModalWindow>
      <ModalWindow isVisible={isBetting}>
        <BetChoice
          defaultBet={user.previousBet || 20}
          onBet={(bet) => handleBet(bet)}
          isTimerOn={!isSingle}
        />
      </ModalWindow>
      <ModalWindow isVisible={isInsurance}>
        <InsuranceOptionChoice
          onChoice={(choice) => handleInsurance(choice)}
          isTimerOn={!isSingle}
        />
      </ModalWindow>
      <GameTableHeader onTableClose={() => {}} />
      <Players
        players={playersState}
        isEnd={isGameEnd}
      />
      {isIdle && <StartGameButton />}
      <Dealer {...dealerState} />
    </main>
  );
});

export default GameTable;
