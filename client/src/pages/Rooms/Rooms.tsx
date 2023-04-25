import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { socket } from '@/socket';
import { GlobalContext } from '@/stores/GlobalStore';

import HelpButton from '@/components/HelpButton/HelpButton';
import Room from '@/components/Room/Room';
import Button from '@/components/Button/Button';

import styles from './rooms.module.css';

const Rooms = observer(() => {
  const { roomsStore } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRoomCreated = (roomId: string) => {
      navigate(`/room/${roomId}`);
    };

    socket.on('player-room-created', handleRoomCreated);

    return () => {
      socket.off('player-room-created', handleRoomCreated);
    };
  }, [navigate]);

  const handleRoomCreate = useCallback(() => {
    socket.emit('player-room-create');
  }, []);

  const handleRoomJoin = useCallback(
    (roomId: string) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  const rooms = useMemo(
    () => roomsStore.rooms.slice().sort((lhs, rhs) => lhs.playersCount - rhs.playersCount),
    [roomsStore.rooms]
  );

  return (
    <main className={styles['rooms']}>
      <div className={styles['rooms__header']}>
        <HelpButton />
        <Button onClick={handleRoomCreate}>create room</Button>
      </div>
      <div className={styles['rooms-list']}>
        {rooms.length ? (
          rooms.map((room) => (
            <Room
              key={room.id}
              {...room}
              onJoin={handleRoomJoin}
            />
          ))
        ) : (
          <span className={styles['rooms_empty']}>No rooms found.</span>
        )}
      </div>
    </main>
  );
});

export default Rooms;
