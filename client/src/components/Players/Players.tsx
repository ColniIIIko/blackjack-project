import React from 'react';

import { PlayerState } from '@/types/state';

import Player from '@/components/Player/Player';

import styles from './players.module.css';

type Props = {
  players: PlayerState[];
  isEnd: boolean;
};

function Players({ players, isEnd }: Props) {
  const style = { '--length': players.length } as React.CSSProperties;
  return (
    <div
      className={styles['players']}
      style={style}
    >
      {players.map((player) => (
        <Player
          key={player.id}
          {...player}
          isEnd={isEnd}
        />
      ))}
    </div>
  );
}

export default Players;
