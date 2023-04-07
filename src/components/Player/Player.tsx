import React from 'react';
import CardHand from '../CardHand/CardHand';
import PlayerInfo from '../PlayerInfo/PlayerInfo';

import styles from './player.module.css';
import { PlayerState } from '../../types/state';
import { getEndGameLabel } from '../../utils/getPlayerEndGameLabel';

type Props = PlayerState & {
  isEnd: boolean;
};

function Player({ hand, isEnd, name, currentHand }: Props) {
  return (
    <div className={styles['player']}>
      {hand.map((hand) => (
        <div key={hand.id}>
          <CardHand
            hand={hand.cards}
            score={hand.score}
            isWin={isEnd && hand.result === 'player'}
            isLose={hand.isBusted || (isEnd && hand.result === 'dealer')}
            isCurrent={currentHand.id === hand.id}
          />
          <PlayerInfo
            bet={hand.bet}
            endGameLabel={getEndGameLabel(isEnd, hand.isBusted, hand.result)}
            isWin={isEnd && hand.result === 'player'}
            isLose={hand.isBusted || (isEnd && hand.result === 'dealer')}
            playerName={name}
          />
        </div>
      ))}
    </div>
  );
}

export default Player;
