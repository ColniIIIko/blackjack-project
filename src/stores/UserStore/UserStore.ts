import { makeAutoObservable } from 'mobx';
import { Bet, User } from '../../types/general';
import { v4 as uuid } from 'uuid';
import { createContext } from 'react';

class UserStore implements User {
  id: string = uuid();
  name: string = 'anonymous';
  balance: number = 1000;
  previousBet: Bet | null = null;

  changeBalance(newBalance: number) {
    this.balance = newBalance;
  }

  increaseBalance(amount: number) {
    this.balance += amount;
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const userStore = new UserStore();
export const UserContext = createContext<UserStore | null>(null);
