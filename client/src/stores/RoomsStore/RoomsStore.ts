import { makeAutoObservable } from 'mobx';
import { Room } from '../../types/general';

class RoomsStore {
  public rooms: Room[] = [];

  updateRooms(rooms: Room[]) {
    this.rooms = rooms;
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const roomsStore = new RoomsStore();
