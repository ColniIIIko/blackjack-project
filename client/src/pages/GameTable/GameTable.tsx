import { observer } from 'mobx-react-lite';
import { useCallback, useContext, useEffect } from 'react';
import { useBlackJackState } from '../../hooks/useBlackJackState';
import { socket } from '../../socket';
import BetChoice from '../../components/BetChoice/BetChoice';
import Dealer from '../../components/Dealer/Dealer';
import InsuranceOptionChoice from '../../components/InsuranceOptionChoice/InsuranceOptionChoice';
import ModalWindow from '../../components/ModalWindow/ModalWindow';
import PlayerOptionChoice from '../../components/PlayerOptionChoice/playerOptionChoice';
import Players from '../../components/Players/Players';
import { PlayerState } from '../../types/state';
import StartGameButton from '../../components/StartGameButton/StartGameButton';
import GameTableHeader from '../../components/GameTableHeader/GameTableHeader';

import styles from './gameTable.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from '../../stores/GlobalStore';

const GameTable = observer(function () {
  const { userStore } = useContext(GlobalContext)!;
  const { id } = useParams();
  const navigate = useNavigate();
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
  } = useBlackJackState(socket, userStore, id!);

  useEffect(() => {
    const onBalanceUpdate = (player: PlayerState) => {
      userStore.changeBalance(player.balance);
    };

    socket.on('player-balance-update', onBalanceUpdate);

    return () => {
      socket.off('player-balance-update', onBalanceUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableClose = useCallback(() => {
    socket.emit('player-room-leave', id || '');
    navigate('/');
  }, [id, navigate]);

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
          defaultBet={userStore.previousBet || 20}
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
      <GameTableHeader onTableClose={handleTableClose} />
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