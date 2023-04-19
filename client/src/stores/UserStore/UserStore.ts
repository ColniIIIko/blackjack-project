import { makeAutoObservable } from 'mobx';
import { Bet, User } from '../../types/general';
import { v4 as uuid } from 'uuid';
import { createContext } from 'react';
import { generateUsername } from 'unique-username-generator';

class UserStore implements User {
  id: string = uuid();
  name: string = generateUsername('', 0, Math.round(Math.random() * 16) + 1);
  balance: number = 1000;
  previousBet: Bet | null = null;

  changeBalance(newBalance: number) {
    this.balance = newBalance;
  }

  increaseBalance(amount: number) {
    this.balance += amount;
  }

  setPreviousBet(bet: Bet) {
    this.previousBet = bet;
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}

export const userStore = new UserStore();
export const UserContext = createContext<UserStore | null>(null);
