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

const GameTable = observer(function () {
  const user = useContext(UserContext)!;
  const {
    playersState,
    dealerState,
    isChoosing,
    isBetting,
    isInsurance,
    playerOptions,
    isGameEnd,
    isSingle,
    handleInsurance,
    handleDecision,
    handleBet,
  } = useBlackJackState(socket, user);

  useEffect(() => {
    socket.on('player-balance-update', (player) => {
      user.changeBalance(player.balance);
    });
  }, [user]);

  return (
    <main className={styles['table']}>
      <ModalWindow isVisible={isChoosing}>
        <PlayerOptionChoice
          onChoice={(choice) => handleDecision(choice)}
          defaultChoice='stand'
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
      <Players
        players={playersState}
        isEnd={isGameEnd}
      />
      <Dealer {...dealerState} />
    </main>
  );
});

export default GameTable;
