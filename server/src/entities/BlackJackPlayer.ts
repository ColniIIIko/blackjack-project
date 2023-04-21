import { Player } from 'types/general';
import { BlackJackPlayerHand } from './BlackJackPlayerHand';
import { PlayerState } from 'types/state';

export class BlackJackPlayer implements Player {
  public hand: BlackJackPlayerHand[];
  public currentHand: BlackJackPlayerHand;
  public isSplitted: boolean;
  public totalWin: number | null;
  public insuranceBet: number | null;
  public isActive: boolean;
  public isCurrent: boolean;

  public socketId: string;

  constructor(public id: string, public name: string, public balance: number, socketId: string) {
    this.hand = [new BlackJackPlayerHand()];
    this.currentHand = this.hand[0];
    this.isSplitted = false;
    this.totalWin = null;
    this.insuranceBet = null;
    this.isActive = false;
    this.socketId = socketId;
    this.isCurrent = false;
  }

  public reset() {
    this.hand = [new BlackJackPlayerHand()];
    this.currentHand = this.hand[0];
    this.isSplitted = false;
    this.totalWin = null;
    this.insuranceBet = null;
    this.isCurrent = false;
    this.isActive = true;
  }

  public splitHand() {
    if (this.hand.length === 0 || this.isSplitted || !this.hand[0].isSplitPossible) return false;

    this.balance -= this.currentHand.bet;
    const card = this.hand[0].cards.pop()!;
    const splittedHand = new BlackJackPlayerHand([card]);
    splittedHand.bet = this.hand[0].bet;
    this.hand.push(splittedHand);
    this.isSplitted = true;

    return true;
  }

  public hasNextHand() {
    if (!this.isSplitted) return false;

    return this.currentHand.id === this.hand[0].id;
  }

  public setNextHand() {
    if (this.hasNextHand()) {
      this.currentHand = this.hand[1];
    }
  }

  public toJSON(): PlayerState {
    return {
      id: this.id,
      name: this.name,
      balance: this.balance,
      hand: this.hand.map((hand) => hand.toJSON()),
      currentHand: this.currentHand,
      isSplitted: this.isSplitted,
      totalWin: this.totalWin,
      insuranceBet: this.insuranceBet,
      isActive: this.isActive,
      isCurrent: this.isCurrent,
    };
  }
}
