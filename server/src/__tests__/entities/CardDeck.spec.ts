import { cardSuits, cardValues } from '../../const';
import { CardDeck } from '../../entities/CardDeck';

describe('CardDeck', () => {
  describe('constructor', () => {
    it('should create a deck with the correct number of cards', () => {
      const decks = 2;
      const cardDeck = new CardDeck(decks);
      const expectedLength = cardSuits.length * cardValues.length * decks;
      expect(cardDeck.length).toBe(expectedLength);
    });

    it('should create a shuffled deck', () => {
      const decks = 2;
      const cardDeck1 = new CardDeck(decks);
      const cardDeck2 = new CardDeck(decks);
      expect(cardDeck1).not.toEqual(cardDeck2);
    });
  });

  describe('drawCard', () => {
    it('should return a card from the deck', () => {
      const cardDeck = new CardDeck(1);
      const card = cardDeck.drawCard(true);
      expect(card).toBeDefined();
    });

    it('should set the isHidden property of the card', () => {
      const cardDeck = new CardDeck(1);
      const card = cardDeck.drawCard(true);
      expect(card?.isHidden).toBe(true);
    });

    it('should remove the card from the deck', () => {
      const cardDeck = new CardDeck(1);
      const initialLength = cardDeck.length;
      const card = cardDeck.drawCard(true);
      const newLength = cardDeck.length;
      expect(newLength).toBe(initialLength - 1);
      expect(cardDeck.deck.includes(card as any)).toBe(false);
    });

    it('should return undefined when the deck is empty', () => {
      const cardDeck = new CardDeck(0);
      const card = cardDeck.drawCard(true);
      expect(card).toBeUndefined();
    });
  });
});
