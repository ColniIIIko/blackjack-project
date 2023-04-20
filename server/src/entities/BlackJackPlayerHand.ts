import { Bet, Winner } from 'types/general';
import { BlackJackHand } from './BlackJackHand';
import { Card } from 'types/cards';
import { PlayerHand } from 'types/state';

export class BlackJackPlayerHand extends BlackJackHand {
  public bet: 0 | Bet;
  public result: Winner | null;
  constructor(cards: Card[] = []) {
    super(cards);
    this.bet = 0;
    this.result = null;
  }

  get isSplitPossible() {
    return this.cards[0].value === this.cards[1].value;
  }

  public toJSON(): PlayerHand {
    return {
      ...super.toJSON(),
      bet: this.bet,
      result: this.result,
    };
  }
}
