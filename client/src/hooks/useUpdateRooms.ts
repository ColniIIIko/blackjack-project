import { useContext, useEffect } from 'react';
import { GlobalContext } from '../stores/GlobalStore';
import { Room } from '../types/general';
import { socket } from '../socket';

export const useUpdateRooms = () => {
  const { roomsStore } = useContext(GlobalContext);

  useEffect(
    () => {
      const handleRoomUpdate = (updatedRooms: Room[]) => {
        roomsStore.updateRooms(updatedRooms);
      };

      socket.on('rooms', handleRoomUpdate);

      return () => {
        socket.off('rooms', handleRoomUpdate);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};
