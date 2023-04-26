# Online Blackjack with Room System

Welcome to Online Blackjack with Room System! This is a classic game of blackjack with multiplayer functionality and a room system.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/ColniIIIko/blackjack-project`
2. Navigate to the client directory: `cd client`
3. Install dependencies: `npm install`
4. Start the client: `npm run dev`
5. Navigate to the server directory: `cd ../server`
6. Install dependencies: `npm install`
7. Start the server: `npm run dev`
8. Open `http://localhost:5173` in your browser to access the game.

## How to Play

The objective of the game is to beat the dealer by having a hand that is worth more points than the dealer's hand, without exceeding 21 points.

Players can create or join other player's rooms. Each player will be dealt two cards, and can choose to "hit" (draw another card), "stand" (keep their current hand), "split" or "double down" to get as close to 21 points as possible.

## Technologies Used

-   React
-   Typescript
-   Mobx
-   React-router
-   Node.js
-   Socket.IO
