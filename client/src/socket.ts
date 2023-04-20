import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './types/socket';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000');
