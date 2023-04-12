import http from 'http';
import { Server } from 'socket.io';
import { SocketController } from './controllers/SocketController';
import { ClientToServerEvents, ServerToClientEvents } from './types/socket';

export class App {
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private controller: SocketController;
  private server: http.Server;
  public port: number;

  constructor(port: number) {
    this.port = port;
    this.server = http.createServer();
    this.io = new Server<ClientToServerEvents, ServerToClientEvents>(this.server, {
      cors: {
        origin: 'http://localhost:5173',
      },
    });
    this.controller = new SocketController(this.io);

    this.initializeConnection();
  }

  private initializeConnection() {
    this.io.on('connection', (socket) => {
      this.controller.initSocket(socket);
    });
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`server is listening port ${this.port}`);
    });
  }
}
