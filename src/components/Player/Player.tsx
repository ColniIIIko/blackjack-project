import React from 'react';
import PlayerCardHand from '../CardHand/PlayerCardHand';
import { PlayerState } from '../../types/state';
import { getEndGameLabel } from '../../utils/getPlayerEndGameLabel';

import styles from './player.module.css';

type Props = PlayerState & {
  isEnd: boolean;
};

function Player({ hand, isEnd, name, currentHand }: Props) {
  return (
    <div className={styles['player']}>
      <div className={styles['player-hand']}>
        {hand.map((hand) => (
          <div key={hand.id}>
            <PlayerCardHand
              hand={hand.cards}
              score={hand.score}
              isWin={isEnd && hand.result === 'player'}
              isLose={hand.isBusted || (isEnd && hand.result === 'dealer')}
              isCurrent={currentHand.id === hand.id}
              endGameLabel={getEndGameLabel(isEnd, hand.isBusted, hand.result)}
              bet={hand.bet}
            />
          </div>
        ))}
      </div>
      <p className={styles['player-name']}>{name}</p>
    </div>
  );
}

export default Player;
