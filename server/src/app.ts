import http from 'http';
import { Server } from 'socket.io';
import { SocketController } from './controllers/SocketController';
import { ClientToServerEvents, ServerToClientEvents } from './types/socket';
import { v4 as uuid } from 'uuid';
import { Room, User } from 'types/general';

export class App {
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private server: http.Server;
  private roomsMap: Map<string, SocketController>;
  public port: number;

  constructor(port: number) {
    this.port = port;
    this.server = http.createServer();
    this.io = new Server<ClientToServerEvents, ServerToClientEvents>(this.server, {
      cors: {
        origin: 'http://localhost:5173',
      },
    });
    this.roomsMap = new Map();
    this.initializeConnection();
  }

  private initializeConnection() {
    this.io.on('connection', (socket) => {
      console.log('rooms', this.getRoomsList());
      socket.emit('rooms', this.getRoomsList());

      socket.on('player-room-enter', (user: User, roomId: string) => {
        const socketController = this.roomsMap.get(roomId);
        if (!socketController) return;

        socketController.joinRoom(user, socket);

        this.io.emit('rooms', this.getRoomsList());
      });

      socket.on('player-room-create', () => {
        const roomId = uuid();
        const socketController = new SocketController(this.io, roomId, this.handlePlayerLeave);

        this.roomsMap.set(roomId, socketController);
        socket.emit('player-room-created', roomId);
        this.io.emit('rooms', this.getRoomsList());
      });
    });
  }

  private handlePlayerLeave = (roomId: string) => {
    const socketController = this.roomsMap.get(roomId);
    if (!socketController) return;
    console.log('ROOMS:', this.getRoomsList());
    if (socketController.playersAmount === 0) {
      console.log('if');
      this.roomsMap.delete(roomId);
    }

    this.io.emit('rooms', this.getRoomsList());
  };

  private getRoomsList() {
    const roomsList: Room[] = [];
    for (const controller of this.roomsMap.values()) {
      const room: Room = {
        id: controller.roomId,
        playersCount: controller.playersAmount,
        maxPlayersCount: controller.maxPlayersAmount,
      };

      roomsList.push(room);
    }

    return roomsList;
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`server is listening port ${this.port}`);
    });
  }
}
