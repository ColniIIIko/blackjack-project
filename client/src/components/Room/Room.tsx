import React from 'react';
import classNames from 'classnames';

import styles from './room.module.css';

type Props = {
  id: string;
  playersCount: number;
  maxPlayersCount: number;
  onJoin: (id: string) => void;
};

function Room({ id, playersCount, maxPlayersCount, onJoin }: Props) {
  const roomStyle = classNames({
    [styles['room']]: true,
    [styles['room_full']]: playersCount === maxPlayersCount,
  });

  return (
    <div
      className={roomStyle}
      onClick={() => onJoin(id)}
    >
      <span>room#{id.slice(0, 4)}</span>
      <span>
        players: {playersCount}/{maxPlayersCount}
      </span>
    </div>
  );
}

export default Room;
