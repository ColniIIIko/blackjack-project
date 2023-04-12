import { BlackJackDealer } from '../../entities/BlackJackDealer';

describe('BlackJackDealer', () => {
  describe('reset', () => {
    it("should reset the dealer's hand", () => {
      const dealer = new BlackJackDealer();
      dealer.hand.cards = [{ value: 'K', suit: 'hearts', isHidden: false }];
      dealer.reset();
      expect(dealer.hand.cards.length).toBe(0);
    });
  });

  describe('getHiddenCardValue', () => {
    it("should return the value of the dealer's hidden card", () => {
      const dealer = new BlackJackDealer();
      dealer.hand.cards = [
        { value: 'K', suit: 'hearts', isHidden: false },
        { value: '9', suit: 'diamonds', isHidden: true },
      ];
      expect(dealer.getHiddenCardValue()).toBe(9);
    });
  });

  describe('isEnded', () => {
    it("should return false if the dealer's score is less than 17", () => {
      const dealer = new BlackJackDealer();
      dealer.hand.cards = [
        { value: 'K', suit: 'hearts', isHidden: false },
        { value: '6', suit: 'diamonds', isHidden: false },
      ];
      expect(dealer.isEnded).toBe(false);
    });

    it("should return true if the dealer's score is greater than or equal to 17", () => {
      const dealer = new BlackJackDealer();
      dealer.hand.cards = [
        { value: 'K', suit: 'hearts', isHidden: false },
        { value: '8', suit: 'diamonds', isHidden: false },
      ];
      expect(dealer.isEnded).toBe(true);
    });
  });

  it('should serialize to JSON correctly', () => {
    const dealer = new BlackJackDealer();
    dealer.hand.cards = [
      { value: 'K', suit: 'hearts', isHidden: false },
      { value: '8', suit: 'diamonds', isHidden: false },
    ];
    const expectedJSON = {
      hand: {
        id: dealer.hand.id,
        cards: [
          { value: 'K', suit: 'hearts', isHidden: false },
          { value: '8', suit: 'diamonds', isHidden: false },
        ],
        score: dealer.hand.score,
        isBlackJack: dealer.hand.isBlackJack,
        isBusted: dealer.hand.isBusted,
      },
      isEnded: dealer.isEnded,
    };
    expect(dealer.toJSON()).toEqual(expectedJSON);
  });
});
