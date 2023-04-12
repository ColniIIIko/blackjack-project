import { Card } from 'types/cards';
import { cardSuits, cardValues } from '../const';

export class CardDeck {
  private deck: Card[] = [];
  constructor(decks: number) {
    this.fill(decks);
    this.shuffle();
  }

  private fill(decks: number) {
    this.deck = [];
    while (decks !== 0) {
      for (const suit of cardSuits) {
        for (const value of cardValues) {
          this.deck.push({ suit, value, isHidden: true });
        }
      }
      decks -= 1;
    }
  }

  private shuffle() {
    if (!this.deck.length) {
      return;
    }

    let index = -1;
    const lastIndex = this.deck.length - 1;
    while (++index < this.deck.length) {
      const rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
      const value = this.deck[rand];
      this.deck[rand] = this.deck[index];
      this.deck[index] = value;
    }
  }

  public get length() {
    return this.deck.length;
  }

  public drawCard(isHidden: boolean) {
    const card = this.deck.pop();
    if (card) {
      card.isHidden = isHidden;
      return card;
    }
  }
}
