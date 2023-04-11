import React from 'react';
import PlayerCardHand from '../CardHand/PlayerCardHand';
import { PlayerState } from '../../types/state';
import { getEndGameLabel } from '../../utils/getPlayerEndGameLabel';
import { CHIP_URL } from '../../const';
import CardSkeleton from '../CardSkeleton/CardSkeleton';

import styles from './player.module.css';

type Props = PlayerState & {
  isEnd: boolean;
};

function Player({ hand, isEnd, name, currentHand, insuranceBet }: Props) {
  return (
    <div className={styles['player']}>
      <div className={styles['player-hand']}>
        {hand.length && hand[0].cards.length ? (
          hand.map((hand) => (
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
          ))
        ) : (
          <div className={styles['cards']}>
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}
      </div>
      <div className={styles['player-info']}>
        <p className={styles['player-name']}>{name}</p>
        {insuranceBet && (
          <div className={styles['insurance-bet']}>
            <img
              height={'18px'}
              width={'18px'}
              src={CHIP_URL.href}
              alt='player bet icon'
            />
            <span>{insuranceBet}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Player;
