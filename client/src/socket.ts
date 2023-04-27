import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './types/socket';

const socketUrl = import.meta.env.DEV ? 'http://localhost:3000' : 'https://blackjack-back.onrender.com';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(socketUrl);
