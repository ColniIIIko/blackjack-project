import { Card } from 'types/cards';
import { BlackJackController } from '../../controllers/BlackJackController';
import { BlackJackDealer } from '../../entities/BlackJackDealer';
import { BlackJackPlayer } from '../../entities/BlackJackPlayer';
import { GameStatus, User } from '../../types/general';

describe('BlackJackController', () => {
  let controller: BlackJackController;

  beforeEach(() => {
    controller = new BlackJackController();
  });

  describe('drawInitialCards', () => {
    it('should draw two cards to each active player and two cards to the dealer', () => {
      controller.players = [
        new BlackJackPlayer('1', 'player 1', 1000, ''),
        new BlackJackPlayer('2', 'player 2', 1000, ''),
      ];
      controller.players[0].isActive = true;
      controller.players[1].isActive = true;
      const initialCards = controller.drawInitialCards();
      expect(initialCards.players[0].currentHand.cards).toHaveLength(2);
      expect(initialCards.players[1].currentHand.cards).toHaveLength(2);
      expect(initialCards.dealer.hand.cards).toHaveLength(2);
    });

    it('should not draw cards to not active players', () => {
      controller.players = [
        new BlackJackPlayer('1', 'player 1', 1000, ''),
        new BlackJackPlayer('2', 'player 2', 1000, ''),
      ];
      controller.players[0].isActive = true;
      const initialCards = controller.drawInitialCards();
      expect(initialCards.players[0].currentHand.cards).toHaveLength(2);
      expect(initialCards.players[1].currentHand.cards).toHaveLength(0);
      expect(initialCards.dealer.hand.cards).toHaveLength(2);
    });
  });

  describe('handlePlayerBet', () => {
    it('should set the player bet and deduct the bet amount from the player balance', () => {
      controller.players = [new BlackJackPlayer('1', 'player 1', 1000, '1')];
      controller.handlePlayerBet('1', 100);
      expect(controller.players[0].currentHand.bet).toEqual(100);
      expect(controller.players[0].balance).toEqual(900);
    });
  });

  describe('handlePlayerDoubleDown', () => {
    it('should double the player bet and deduct the bet amount from the player balance', () => {
      controller.currentPlayer = new BlackJackPlayer('1', 'player 1', 1000, '');
      controller.currentPlayer.currentHand.bet = 100;
      controller.handlePlayerDoubleDown();
      expect(controller.currentPlayer.currentHand.bet).toEqual(200);
      expect(controller.currentPlayer.balance).toEqual(900);
    });
  });

  describe('handlePlayerInsurance', () => {
    it('should set the player insurance bet and deduct the bet amount from the player balance', () => {
      controller.players = [new BlackJackPlayer('1', 'player 1', 1000, '1')];
      controller.players[0].currentHand.bet = 100;
      controller.handlePlayerInsurance('1');
      expect(controller.players[0].insuranceBet).toEqual(50);
      expect(controller.players[0].balance).toEqual(950);
    });
  });

  describe('handleNewUser', () => {
    it('should create a new BlackJackPlayer instance and add it to the players array', () => {
      const user = { id: '1', name: 'player 1', balance: 1000 };
      controller.handleNewUser(user, '');
      expect(controller.players).toHaveLength(1);
      expect(controller.players[0].id).toEqual('1');
      expect(controller.players[0].name).toEqual('player 1');
      expect(controller.players[0].balance).toEqual(1000);
    });

    it('should set the first player to active if the game is idle', () => {
      const user = { id: '1', name: 'player 1', balance: 1000 };
      controller.gameStatus = GameStatus.IDLE;
      controller.handleNewUser(user, 'abc123');

      expect(controller.players[0].isActive).toBe(true);
    });

    it('should not set any players to active if the game is not idle', () => {
      const user = { id: '1', name: 'player 1', balance: 1000 };
      controller.gameStatus = GameStatus.PLAYING;
      controller.handleNewUser(user, 'abc123');
      expect(controller.players.length).toBe(1);
      expect(controller.players[0].isActive).toBe(false);
    });
  });

  describe('drawPlayerCard', () => {
    it('should add a new card to the current player hand from deck', () => {
      controller.currentPlayer = new BlackJackPlayer('1', 'player 1', 1000, '');
      controller.deck.deck = [{ value: '2', suit: 'spades', isHidden: false }];
      controller.drawPlayerCard();
      expect(controller.currentPlayer.currentHand.cards).toHaveLength(1);
      expect(controller.currentPlayer.currentHand.cards[0].value).toEqual('2');
      expect(controller.currentPlayer.currentHand.cards[0].suit).toEqual('spades');
    });
  });

  describe('drawDealerCard', () => {
    beforeEach(() => {
      controller.dealer = new BlackJackDealer();
    });

    it('should reveal second dealer card if it is hidden', () => {
      controller.dealer.hand.cards = [
        { value: '2', suit: 'spades', isHidden: false },
        { value: '10', suit: 'diamonds', isHidden: true },
      ];

      controller.drawDealerCard();
      expect(controller.dealer.hand.cards[1].isHidden).toBe(false);
    });

    it('should draw a new card if the dealer hand is not ended and there are no hidden cards', () => {
      controller.dealer.hand.cards = [
        { value: '2', suit: 'spades', isHidden: false },
        { value: '10', suit: 'diamonds', isHidden: false },
      ];

      const card: Card = { value: 'J', suit: 'hearts', isHidden: false };
      controller.deck.deck = [card];
      controller.drawDealerCard();
      expect(controller.dealer.hand.cards).toHaveLength(3);
      expect(controller.dealer.hand.cards[2]).toEqual(card);
    });

    it('should not draw a new card if the dealer hand is ended', () => {
      controller.dealer.hand.cards = [
        { value: '8', suit: 'spades', isHidden: false },
        { value: '10', suit: 'diamonds', isHidden: false },
      ];

      controller.drawDealerCard();
      expect(controller.dealer.hand.cards).toHaveLength(2);
    });
  });

  describe('setNextPlayer', () => {
    let player1: User;
    let player2: User;
    beforeEach(() => {
      player1 = { id: '1', name: 'player1', balance: 100 };
      player2 = { id: '2', name: 'player2', balance: 100 };
      controller.handleNewUser(player1, 'socket1');
      controller.handleNewUser(player2, 'socket2');
      controller.gameReset();
    });

    it('should set the next player as the current player', () => {
      controller.setNextPlayer();
      expect(controller.currentPlayer?.id).toEqual('2');
    });

    it('should not set the next player as the current player when there are no active players after the current player', () => {
      controller.setNextPlayer();
      expect(controller.currentPlayer?.id).toEqual('2');
      controller.setNextPlayer();
      expect(controller.currentPlayer?.id).toEqual('2');
    });
  });

  describe('removePlayerBySocketId', () => {
    it('should delete existing player from controller player array', () => {
      const player1 = { id: '1', name: 'player1', balance: 100 };
      const player2 = { id: '2', name: 'player2', balance: 100 };
      controller.handleNewUser(player1, 'socket1');
      controller.handleNewUser(player2, 'socket2');
      controller.gameReset();
      expect(controller.players).toHaveLength(2);
      controller.removePlayerBySocketId('socket2');
      expect(controller.players).toHaveLength(1);
      expect(controller.players.find((p) => p.id === '2')).toBeUndefined();
    });
  });

  describe('setGameResult', () => {
    let player1: User;
    beforeEach(() => {
      player1 = { id: '1', name: 'player1', balance: 100 };
      controller.handleNewUser(player1, 'socket1');
      controller.gameReset();
      controller.players[0].currentHand.bet = 50;
    });
    it('should update the game results correctly when dealer is not busted and player has higher score', () => {
      controller.players[0].currentHand.cards = [
        { value: '9', suit: 'spades', isHidden: false },
        { value: '10', suit: 'diamonds', isHidden: false },
      ];

      controller.dealer.hand.cards = [
        { value: '7', suit: 'hearts', isHidden: false },
        { value: 'A', suit: 'clubs', isHidden: false },
      ];

      controller.setGameResults();
      expect(controller.players[0].currentHand.result).toEqual('player');
      expect(controller.players[0].balance).toEqual(200);
    });

    it('should update the game results correctly when dealer is not busted and player has lower score', () => {
      controller.players[0].currentHand.cards = [
        { value: '6', suit: 'spades', isHidden: false },
        { value: '10', suit: 'diamonds', isHidden: false },
      ];

      controller.dealer.hand.cards = [
        { value: '7', suit: 'hearts', isHidden: false },
        { value: 'A', suit: 'clubs', isHidden: false },
      ];

      controller.setGameResults();
      expect(controller.players[0].currentHand.result).toEqual('dealer');
      expect(controller.players[0].balance).toEqual(100);
    });

    it('should update the game results correctly when dealer is not busted and player has equal score with dealer', () => {
      controller.players[0].currentHand.cards = [
        { value: '7', suit: 'spades', isHidden: false },
        { value: '10', suit: 'diamonds', isHidden: false },
      ];

      controller.dealer.hand.cards = [
        { value: '7', suit: 'hearts', isHidden: false },
        { value: 'K', suit: 'clubs', isHidden: false },
      ];

      controller.setGameResults();
      expect(controller.players[0].currentHand.result).toEqual('draw');
      expect(controller.players[0].balance).toEqual(150);
    });

    it('should update the game results correctly when player is busted', () => {
      controller.players[0].currentHand.cards = [
        { value: '7', suit: 'spades', isHidden: false },
        { value: '10', suit: 'clubs', isHidden: false },
        { value: '10', suit: 'diamonds', isHidden: false },
      ];

      controller.dealer.hand.cards = [
        { value: '7', suit: 'hearts', isHidden: false },
        { value: 'A', suit: 'clubs', isHidden: false },
      ];

      controller.setGameResults();
      expect(controller.players[0].currentHand.result).toEqual('dealer');
      expect(controller.players[0].balance).toEqual(100);
    });

    it('should update the game results correctly when dealer is busted', () => {
      controller.players[0].currentHand.cards = [{ value: '7', suit: 'spades', isHidden: false }];

      controller.dealer.hand.cards = [
        { value: '7', suit: 'hearts', isHidden: false },
        { value: 'K', suit: 'clubs', isHidden: false },
        { value: 'Q', suit: 'diamonds', isHidden: false },
      ];

      controller.setGameResults();
      expect(controller.players[0].currentHand.result).toEqual('player');
      expect(controller.players[0].balance).toEqual(200);
    });
  });
});
