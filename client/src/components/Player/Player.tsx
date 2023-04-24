import React, { useContext, useMemo } from 'react';
import PlayerCardHand from '../CardHand/PlayerCardHand';
import { PlayerState } from '../../types/state';
import { getEndGameLabel } from '../../utils/getPlayerEndGameLabel';
import CardSkeleton from '../CardSkeleton/CardSkeleton';
import PlayerInfo from './PlayerInfo';
import classNames from 'classnames';

import styles from './player.module.css';
import { GlobalContext } from '../../stores/GlobalStore';

type Props = PlayerState & {
  isEnd: boolean;
};

function Player({ hand, isEnd, name, currentHand, insuranceBet, isCurrent, id }: Props) {
  const { userStore } = useContext(GlobalContext);

  const playerStyle = useMemo(
    () =>
      classNames({
        [styles['player']]: true,
        [styles['player_i']]: userStore.name === name,
      }),
    [name, userStore.name]
  );

  return (
    <div className={playerStyle}>
      <div className={styles['player-hand']}>
        {hand.length && hand[0].cards.length ? (
          hand.map((hand) => (
            <div key={hand.id}>
              <PlayerCardHand
                hand={hand.cards}
                score={hand.score}
                isWin={isEnd && hand.result === 'player'}
                isLose={hand.isBusted || (isEnd && hand.result === 'dealer')}
                isCurrent={isCurrent && currentHand.id === hand.id}
                endGameLabel={getEndGameLabel(isEnd, hand.isBusted, hand.result)}
                bet={hand.bet}
              />
            </div>
          ))
        ) : (
          <div className={styles['cards']}>
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}
      </div>
      <PlayerInfo
        id={id}
        name={name}
        insuranceBet={insuranceBet}
      />
    </div>
  );
}

export default Player;
