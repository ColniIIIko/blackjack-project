import { makeAutoObservable } from 'mobx';
import { userStore } from './UserStore/UserStore';
import { roomsStore } from './RoomsStore/RoomsStore';
import { createContext } from 'react';

export class GlobalStore {
  public userStore = userStore;
  public roomsStore = roomsStore;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const globalStore = new GlobalStore();
export const GlobalContext = createContext<GlobalStore>(globalStore);
