import React, { useCallback, useContext, useEffect } from 'react';
import { socket } from '../../socket';
import Room from '../../components/Room/Room';
import HelpButton from '../../components/HelpButton/HelpButton';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { GlobalContext } from '../../stores/GlobalStore';

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

  return (
    <main className={styles['rooms']}>
      <div className={styles['rooms__header']}>
        <HelpButton />
        <Button onClick={handleRoomCreate}>create room</Button>
      </div>
      <div className={styles['rooms-list']}>
        {roomsStore.rooms.length ? (
          roomsStore.rooms.map((room) => (
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
